var digraphTest = require("./digraph-test"),
    baseCompountGraphTest = require("./base-compound-graph-test");

var CDigraph = require("..").CDigraph;

describe("CDigraph", function() {
  // Inject digraph tests
  digraphTest.tests(CDigraph);

  // Inject base compound graph tests
  baseCompountGraphTest.tests(CDigraph);
});
