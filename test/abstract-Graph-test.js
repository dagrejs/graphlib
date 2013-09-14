var assert = require("./assert");

module.exports = function(Graph) {
  var g;

  beforeEach(function() {
    g = new Graph();
  });

  require("./abstract-BaseGraph-test")(Graph);

  describe("asDirected", function() {
    var g;

    beforeEach(function() {
      g = new Graph();
      g.addNode(1);
      g.addNode(2);
      g.addNode(3);
      g.addNode(4);
      g.addEdge("A", 1, 2, "A");
      g.addEdge("B", 2, 3, "B");
      g.addEdge("C", 3, 4, "C");
      g.addEdge("D", 4, 1, "D");
      g.addEdge("E", 4, 2, "E");
    });

    it("returns a directed graph", function() {
      assert.isTrue(g.asDirected().isDirected());
    });

    it("has the same nodes", function() {
      assert.deepEqual(g.asDirected().nodes().sort(), [1, 2, 3, 4]);
    });

    it("has double the size", function() {
      assert.equal(g.asDirected().size(), 10);
    });

    it("preserves edge labels", function() {
      var dg = g.asDirected();
      assert.equal(dg.edge(dg.outEdges(1, 2)[0]), "A");
      assert.equal(dg.edge(dg.outEdges(2, 1)[0]), "A");
      assert.equal(dg.edge(dg.outEdges(2, 3)[0]), "B");
      assert.equal(dg.edge(dg.outEdges(3, 2)[0]), "B");
      assert.equal(dg.edge(dg.outEdges(3, 4)[0]), "C");
      assert.equal(dg.edge(dg.outEdges(4, 3)[0]), "C");
      assert.equal(dg.edge(dg.outEdges(4, 1)[0]), "D");
      assert.equal(dg.edge(dg.outEdges(1, 4)[0]), "D");
      assert.equal(dg.edge(dg.outEdges(4, 2)[0]), "E");
      assert.equal(dg.edge(dg.outEdges(2, 4)[0]), "E");
    });
  });

  describe("isDirected", function() {
    it("always returns false", function() {
      assert.isFalse(new Graph().isDirected());
    });
  });
};
