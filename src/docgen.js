#!/usr/bin/env node

var fs = require("fs"),
    jade = require("jade");

var argv = process.argv;

if (argv.length !== 3) {
  process.stderr.write("usage: " + argv[0] + " " + argv[1] + " <JADE_TEMPLATE>\n");
  process.exit(1);
}

// Get version
var packageFile = fs.readFileSync("package.json");
var packageJson = JSON.parse(packageFile);
var version = packageJson.version;

// Load template
var templateFile = argv[2];
var template = fs.readFileSync(templateFile);

// Compile template
var fn = jade.compile(template, {
  filename: templateFile,
  pretty: true
});

// Render and output template
console.log(fn({
  version: version
}));
