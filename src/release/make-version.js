#!/usr/bin/env node

var packagejson = require('../../package.json');
console.log('module.exports = \'' + packagejson.version + '\';');
