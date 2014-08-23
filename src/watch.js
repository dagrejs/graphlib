#!/usr/bin/env node

/*
 * Watches all globs specified as arguments to this command and emits a
 * message on STDOUT whenever there is a change.
 */

var Gaze = require("gaze").Gaze,
    _ = require("lodash");

var globs = ["lib/**", "test/**", "package.json"];
var gaze = new Gaze(globs);


gaze.on("all", _.debounce(function(_, fp) {
  if (!fp.match("lib/version.js")) {
    console.log("change");
  }
}, 500));
