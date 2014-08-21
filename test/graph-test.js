var expect = require("./chai").expect;

var Graph = require("..").Graph;

describe("Graph", function() {
  var g;

  beforeEach(function() {
    g = new Graph();
  });

  describe("constructor", function() {
    it("creates an empty graph", function() {
      expectEmptyGraph(g);
      expect(g.has("key")).to.be.false;
      expect(g.get("key")).to.be.undefined;
      expect(g.hasEdge("n1", "n2")).to.be.false;
      expect(g.getEdge("n1", "n2")).to.be.undefined;
    });
  });

  describe("remove", function() {
    it("removes any incident edges", function() {
      g.setEdge("n1", "n2");
      g.remove("n1");
      expect(g.hasEdge("n1", "n2")).to.be.false;
      expect(g.graphEdgeCount()).to.equal(0);
      expectSingleNodeGraph(g, "n2", undefined);
    });

    it("decrements edge count once when deleting a self-loop", function() {
      g.setEdge("n1", "n1");
      g.remove("n1");
      expect(g.graphEdgeCount()).to.equal(0);
    });
  });

  describe("neighbors", function() {
    it("returns the neighbors of a node", function() {
      g.setEdge("n1", "n1");
      g.setEdge("n1", "n2");
      g.setEdge("n2", "n3");
      g.setEdge("n3", "n1");
      expect(g.neighbors("n1").sort()).to.eql(["n1", "n2", "n3"]);
    });

    it("returns undefined if the node is not in the graph", function() {
      expect(g.neighbors("n1")).to.be.undefined;
    });
  });

  describe("setEdge", function() {
    it("creates the edge if it does not exist", function() {
      g.set("n1");
      g.set("n2");
      g.setEdge("n1", "n2", "label");
      expectSingleEdgeGraph(g, "n1", "n2", "label");
    });

    it("creates the incident nodes if they don't exist", function() {
      g.setEdge("n1", "n2", "label");
      expect(g.has("n1")).to.be.true;
      expect(g.has("n2")).to.be.true;
      expectSingleEdgeGraph(g, "n1", "n2", "label");
    });

    it("replaces the edge's label if the edge is part of the graph", function() {
      g.setEdge("n1", "n2", "old");
      g.setEdge("n1", "n2", "new");
      expectSingleEdgeGraph(g, "n1", "n2", "new");
    });

    it("is chainable", function() {
      var g2 = g.setEdge("n1", "n2");
      expect(g).to.equal(g2);
    });
  });

  describe("updateEdge", function() {
    var updater = function(label) { return label + "-new"; };

    it("adds and updates the edge if it does not exist", function() {
      g.updateEdge("n1", "n2", updater);
      expectSingleEdgeGraph(g, "n1", "n2", undefined + "-new");
    });

    it("updates the edge's label if it is in the graph", function() {
      g.setEdge("n1", "n2", "label");
      g.updateEdge("n1", "n2", updater);
      expectSingleEdgeGraph(g, "n1", "n2", "label-new");
    });

    it("is chainable", function() {
      var g2 = g.updateEdge("n1", "n2", updater);
      expect(g).to.equal(g2);
    });
  });

  describe("removeEdge", function() {
    it("does nothing if the edge is not in the graph", function() {
      g.removeEdge("n1", "n2");
      expectEmptyGraph(g);
    });

    it("removes the edge if it is in the graph", function() {
      g.setEdge("n1", "n2");
      g.removeEdge("n1", "n2");
      expect(g.hasEdge("n1", "n2")).to.be.false;
      expect(g.graphEdgeCount()).to.equal(0);
    });

    it("is chainable", function() {
      var g2 = g.removeEdge("n1", "n2");
      expect(g).to.equal(g2);
    });
  });

  describe("copy", function() {
    it("creates a shallow copy of the input graph", function() {
      g.set("n1", "label");
      g.setEdge("n2", "n3", "n2n3");

      var copy = g.copy();
      expect(copy.graphNodeCount()).to.equal(3);
      expect(copy.get("n1")).to.equal(g.get("n1"));
      expectSingleEdgeGraph(copy, "n2", "n3", "n2n3");

      copy.setEdge("n2", "n3", "new-n2n3");
      expect(g.getEdge("n2", "n3")).to.equal("n2n3");
    });

    it("copies a single node graph", function() {
      g.set("n1", "label");

      var copy = g.copy();
      expectSingleNodeGraph(g, "n1", "label");

      copy.set("n1", "new-label");
      expect(g.get("n1")).to.equal("label");
    });
  });
});

function expectEmptyGraph(g) {
  expect(g.graphNodeIds()).to.be.empty;
  expect(g.graphNodeCount()).to.equal(0);
  expect(g.edges()).to.be.empty;
  expect(g.graphEdgeCount()).to.equal(0);
}

function expectSingleNodeGraph(g, key, label) {
  expect(g.graphNodeIds()).to.include(key);
  expect(g.get(key)).to.equal(label);
  expect(g.has(key)).to.be.true;
  expect(g.graphNodeCount()).to.equal(1);
}

function expectSingleEdgeGraph(g, v, w, label) {
  expect(g.edges()).to.eql([{ v: v, w: w, label: label }]);
  expect(g.getEdge(v, w)).to.equal(label);
  expect(g.hasEdge(v, w)).to.be.true;
  expect(g.graphEdgeCount()).to.equal(1);
}
