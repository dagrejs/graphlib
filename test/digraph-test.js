var expect = require("./chai").expect;

var Digraph = require("../lib/digraph");

describe("Digraph", function() {
  var g;

  beforeEach(function() {
    g = new Digraph();
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

  describe("set", function() {
    it("creates the node if it isn't part of the graph", function() {
      g.set("key", "label");
      expectSingleNodeGraph(g, "key", "label");
    });

    it("replaces the node's value if it is part of the graph", function() {
      g.set("key", "old");
      g.set("key", "new");
      expectSingleNodeGraph(g, "key", "new");
    });

    it("sets the label to undefined if called with one arg", function() {
      g.set("key");
      expect(g.get("key")).to.be.undefined;
    });

    it("is chainable", function() {
      var g2 = g.set("key", "label");
      expect(g).to.equal(g2);
    });
  });

  describe("update", function() {
    var updater = function(prev) { return prev + "-new"; };

    it("creates the node if it isn't part of the graph", function() {
      g.update("key", updater);
      expectSingleNodeGraph(g, "key", undefined + "-new");
    });

    it("replaces the node's label if the node is part of the graph", function() {
      g.set("key", "label");
      g.update("key", updater);
      expectSingleNodeGraph(g, "key", "label-new");
    });

    it("is chainable", function() {
      var g2 = g.update("key", updater);
      expect(g).to.equal(g2);
    });
  });

  describe("delete", function() {
    it("does nothing if the node is not part of the graph", function() {
      g.delete("key");
      expectEmptyGraph(g);
    });

    it("deletes the node if it is part of the graph", function() {
      g.set("key", "label");
      g.delete("key");
      expectEmptyGraph(g);
    });

    it("deletes any in edges", function() {
      g.setEdge("n1", "n2");
      g.delete("n2");
      expect(g.hasEdge("n1", "n2")).to.be.false;
      expect(g.numEdges()).to.equal(0);
      expectSingleNodeGraph(g, "n1", undefined);
    });

    it("deletes any out edges", function() {
      g.setEdge("n1", "n2");
      g.delete("n1");
      expect(g.hasEdge("n1", "n2")).to.be.false;
      expect(g.numEdges()).to.equal(0);
      expectSingleNodeGraph(g, "n2", undefined);
    });

    it("decrements edge count once when deleting a self-loop", function() {
      g.setEdge("n1", "n1");
      g.delete("n1");
      expect(g.numEdges()).to.equal(0);
    });

    it("is chainable", function() {
      var g2 = g.delete("key");
      expect(g).to.equal(g2);
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

  describe("deleteEdge", function() {
    it("does nothing if the edge is not in the graph", function() {
      g.deleteEdge("n1", "n2");
      expectEmptyGraph(g);
    });

    it("removes the edge if it is in the graph", function() {
      g.setEdge("n1", "n2");
      g.deleteEdge("n1", "n2");
      expect(g.hasEdge("n1", "n2")).to.be.false;
      expect(g.numEdges()).to.equal(0);
    });

    it("is chainable", function() {
      var g2 = g.deleteEdge("n1", "n2");
      expect(g).to.equal(g2);
    });
  });
});

function expectEmptyGraph(g) {
  expect(g.nodes()).to.be.empty;
  expect(g.numNodes()).to.equal(0);
  expect(g.nodeIds()).to.be.empty;
  expect(g.numEdges()).to.equal(0);
}

function expectSingleNodeGraph(g, key, label) {
  expect(g.nodeIds()).to.include(key);
  expect(g.get(key)).to.equal(label);
  expect(g.has(key)).to.be.true;
  expect(g.numNodes()).to.equal(1);
}

function expectSingleEdgeGraph(g, v, w, label) {
  expect(g.getEdge(v, w)).to.equal(label);
  expect(g.hasEdge(v, w)).to.be.true;
  expect(g.numEdges()).to.equal(1);
}
