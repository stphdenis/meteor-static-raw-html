Package.describe({
  name: 'sdenis:static-raw-html',
  version: '1.0.8',
  summary: 'It is similar to static-html but get\'s the html and jade files with <template> too.',
  git: 'http://github.com/stphdenis/meteor-static-raw-html.git',
  documentation: 'README.md',
});

Package.onUse(function onUse(api) {
  api.versionsFrom('1.3');
  api.use('isobuild:compiler-plugin@1.0.0');
  api.use('ecmascript@0.4.3');
});

Package.registerBuildPlugin({
  name: 'index_compiler',
  use: [
    'caching-html-compiler@1.0.6',
    'ecmascript@0.4.3',
    'templating-tools@1.0.4',
    'underscore@1.0.8',
  ],
  sources: [
    'plugin/index-handle/html-compiler.js',
    'plugin/index-handle/html-scanner.js',
    'plugin/index-handle/index-compiler.js',
  ],
});

Package.registerBuildPlugin({
  name: 'html_compiler',
  use: [
    'ecmascript@0.4.3',
    'caching-compiler@1.0.4',
    'html-tools@1.0.9',
  ],
  sources: [
    'plugin/html-compiler.js',
  ],
  npmDependencies: {
    'html-minifier': '2.1.3',
    crc: '3.4.0',
  },
});

Package.registerBuildPlugin({
  name: 'jade_compiler',
  use: [
    'ecmascript@0.4.3',
    'caching-compiler@1.0.4',
  ],
  sources: [
    'plugin/jade-compiler.js',
  ],
  npmDependencies: {
    jade: '1.11.0',
    crc: '3.4.0',
  },
});

Package.onTest(function onTest(api) {
  api.use('tinytest');
  api.use('ecmascript');
  api.use('sdenis:static-raw-html');
  api.addFiles('meteor-static-raw-html-tests.js');
});
