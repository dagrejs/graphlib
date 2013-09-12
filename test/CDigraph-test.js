var CDigraph = require("..").CDigraph,
    Digraph = require("..").Digraph;

describe("CDigraph", function() {
  require("./abstract-compoundify-test.js")("CDigraph", CDigraph, "Digraph", Digraph);
});
