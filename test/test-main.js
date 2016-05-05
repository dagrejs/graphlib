/* global require */

var allTestFiles = [];
var TEST_REGEXP = /(spec|test)\.js$/i;

// Get a list of all the test files to include
Object.keys(this.__karma__.files).forEach(function(file) {
  if (TEST_REGEXP.test(file)) {
    // Normalize paths to RequireJS module names.
    // If you require sub-dependencies of test files to be loaded as-is (requiring file extension)
    // then do not normalize the paths
    var normalizedTestModule = file.replace(/^\/base\/|\.js$/g, '');
    allTestFiles.push(normalizedTestModule);
  }
});

require.config({
  // Karma serves files under /base, which is the basePath from your config file
  baseUrl: '/base',

  paths:{
    chai: 'node_modules/chai/chai',
    lodash: 'node_modules/lodash/lodash',
    graphlib: 'build/graphlib',
    'graphlib.core': 'build/graphlib.core'
  },

  shim: {
    'graphlib.core': {
      deps: ["lodash"],
      exports: "graphlib.core" //any even not existing var could be defined here.
    }
  },

  // dynamically load all test files
  deps: allTestFiles,

  // we have to kickoff jasmine, as it is asynchronous
  callback: this.__karma__.start
});
