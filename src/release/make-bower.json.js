#!/usr/bin/env node

// Renders the bower.json template and prints it to stdout

var template = {
  name: "graphlib",
  version: require("../../package.json").version,
  main: [ "dist/graphlib.core.js", "dist/graphlib.core.min.js" ],
  ignore: [
    ".*",
    "README.md",
    "CHANGELOG.md",
    "Makefile",
    "browser.js",
    "index.js",
    "karma*",
    "lib/**",
    "package.json",
    "src/**",
    "test/**"
  ],
  dependencies: {
    "lodash": "^2.4.1"
  }
};

console.log(JSON.stringify(template, null, 2));
