#!/usr/bin/env node

var package = require('../../package.json');
console.log('export const version = \'' + package.version + '\';');
