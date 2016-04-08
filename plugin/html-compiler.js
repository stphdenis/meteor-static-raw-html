const minify = Npm.require('html-minifier').minify;
const crc = Npm.require('crc');
// const debug = Npm.require('debug')('ts:debug:');

Plugin.registerCompiler({
  extensions: ['html', 'au.html'],
  archMatching: 'web',
  isTemplate: true,
  filenames: [],
}, () => new HTMLCompiler()
);

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
    moduleName = packageName ? packageName + '/' + moduleName : moduleName;
    const src = inputFile.getContentsAsString()
    // Just parse the html to make sure it is correct before minifying
    try {
      HTMLTools.parseFragment(src)
    } catch (err) {
      return inputFile.error({
        message: "HTML syntax error: " + err.message,
        sourcePath: inputFile.getPathInPackage(),
      });
    }
    return {
      code: this.buildTemplate(src, moduleName),
      path: fileName + '.js',
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

  buildTemplate(src, moduleName) {
    return `module.exports = "${this.clean(src)}";`;
  }

  clean(src) {
    const result = minify(src, {
      collapseWhitespace: true,
      removeComments: true,
    })
    .replace(/(["\\])/g, '\\$1')
    .replace(/[\f]/g, "\\f")
    .replace(/[\b]/g, "\\b")
    .replace(/[\n]/g, "\\n")
    .replace(/[\t]/g, "\\t")
    .replace(/[\r]/g, "\\r")
    .replace(/[\u2028]/g, "\\u2028")
    .replace(/[\u2029]/g, "\\u2029");

    return result;
  }
}

HTMLCompiler.systemjsDefined = false;
