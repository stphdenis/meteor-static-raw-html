const minify = Npm.require('html-minifier').minify;
const crc = Npm.require('crc');

class HTMLCompiler extends CachingCompiler {
  constructor() {
    super({
      compilerName: 'HTMLCompiler',
      defaultCacheSize: 1024 * 1024 * 10,
    });
  }

  getCacheKey(inputFile) {
    return inputFile.getSourceHash() + crc.crc32(inputFile.getPathInPackage()).toString(32);
  }

  compileResultSize(compileResult) {
    return compileResult.code.length;
  }

  compileOneFile(inputFile) {
    const fileName = inputFile.getPathInPackage();
    const packageName = inputFile.getPackageName();

    if (fileName === 'index.html') {
      return undefined;
    }
    let moduleName = fileName.replace(/(\.au)?\.html$/, '').replace(/\\/g, '/');
    moduleName = packageName ? `${packageName}/${moduleName}` : moduleName;
    const src = inputFile.getContentsAsString();
    // Parse the html to make sure it is correct before minifying
    // and to extract the modules'name from <require> tags.
    let fragment;
    try {
      fragment = HTMLTools.parseFragment(src);
    } catch (err) {
      return inputFile.error({
        message: `HTML syntax error: ${err.message}`,
        sourcePath: inputFile.getPathInPackage(),
      });
    }
    const requiredModules = this.extractRequiredModules(fragment);
    return {
      code: this.buildTemplate(src, moduleName, requiredModules),
      path: `${fileName}`,
    };
  }

  addCompileResult(inputFile, compileResult) {
    inputFile.addJavaScript({
      path: compileResult.path,
      sourcePath: inputFile.getPathInPackage(),
      data: compileResult.code,
      bare: false,
    });
  }

  extractRequiredModules(fragment) {
    const results = [];
    const process = children => {
      if (children === null || typeof children === 'undefined'){
        return;
      }
      const nbrChildren = children.length;
      for(let iChild = 0; iChild < nbrChildren;) {
        const child = children[iChild++];
        if (child.tagName && child.tagName === 'require') {
          const fromAttr = child.attrs.from;
          if (fromAttr.startsWith('.')) {
            results.push(child.attrs.from);
          } else {
            // We just need the module name
            // For example, we don't need 'aurelia-template-ressource/if'
            //   but just 'aurelia-template-ressource'
            results.push(child.attrs.from.split('/')[0]);
          }
        }
        if (Array.isArray(child.children)) {
          process(child.children);
        }
      }
    };
    process(fragment);
    return results;
  }

  buildTemplate(src, moduleName, requiredModules) {
    let requires = requiredModules.reduce((res, x) => `${res}  require("${x}");\n`, '');
    // Meteor have just to bundle the modules but does not have to load them at this time
    if (requires.length) {
      requires = `if(false) {\n${requires}}\n`;
    }
    return `${requires}module.exports = "${this.clean(src)}";`;
  }

  clean(src) {
    const result = minify(src, {
      collapseWhitespace: true,
      removeComments: true,
    })
    .replace(/(["\\])/g, '\\$1')
    .replace(/[\f]/g, '\\f')
    .replace(/[\b]/g, '\\b')
    .replace(/[\n]/g, '\\n')
    .replace(/[\t]/g, '\\t')
    .replace(/[\r]/g, '\\r')
    .replace(/[\u2028]/g, '\\u2028')
    .replace(/[\u2029]/g, '\\u2029');

    return result;
  }
}

Plugin.registerCompiler(
  {
    extensions: ['html', 'au.html'],
    archMatching: 'web',
    isTemplate: true,
    filenames: [],
  },
  () => new HTMLCompiler()
);

HTMLCompiler.systemjsDefined = false;
