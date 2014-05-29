var allTestFiles = [];
var TEST_REGEXP = /(demo|spec|test)\.js$/i;

var pathToModule = function(path) {
  // from baseUrl, like '/base/library', to '/base/test'
  return path.replace(/^\/base\//, '../').replace(/\.js$/, '');
};

Object.keys(window.__karma__.files).forEach(function(file) {
  if (TEST_REGEXP.test(file)) {
    // Normalize paths to RequireJS module names.
    allTestFiles.push(pathToModule(file));
  }
});

require.config({
  // Karma serves files under /base, which is the basePath from your config file
  baseUrl: '/base/library',

  // dynamically load all test files
  deps: allTestFiles,

  paths: {
    'sinon': '../external/test/sinon',
    'Squire': '../external/test/Squire'
  },

  shim: {
    'sinon': {
      exports: 'sinon'
    }
  },

  // we have to kickoff jasmine, as it is asynchronous
  callback: window.__karma__.start
});
