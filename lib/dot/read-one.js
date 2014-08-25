var grammar = require("./grammar"),
    buildGraph = require("./build-graph");

module.exports = function readOne(str) {
  var parseTree = grammar.parse(str, { startRule: "graphStmt" });
  return buildGraph(parseTree);
};

