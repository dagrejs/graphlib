var graphTest = require("./graph-test"),
    baseCompoundGraphTest = require("./base-compound-graph-test");

var CGraph = require("..").CGraph;

describe("CGraph", function() {
  // Inject digraph tests
  graphTest.tests(CGraph);

  // Inject base compound graph tests
  baseCompoundGraphTest.tests(CGraph);
});
