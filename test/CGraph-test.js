var CGraph = require("..").CGraph,
    Graph = require("..").Graph;

describe("CGraph", function() {
  require("./abstract-compoundify-test.js")("CGraph", CGraph, "Graph", Graph);
});
