var _ = require("lodash"),
    grammar = require("./grammar"),
    buildGraph = require("./build-graph");

module.exports = function readMany(str) {
  var parseTree = grammar.parse(str);
  return _.map(parseTree, buildGraph);
};
