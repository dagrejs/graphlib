#!/usr/bin/env node

// Renders the bower.json template and prints it to stdout

var template = {
  name: 'graphlib',
  version: require('../../package.json').version,
  main: ['js/graphlib.js', 'js/graphlib.min.js',
         'js/graphlib.full.js', 'js/graphlib.full.min.js'],
  ignore: [
    'README.md'
  ],
  dependencies: {
    'lodash': '^2.4.1'
  }
};

console.log(JSON.stringify(template, null, 2));
