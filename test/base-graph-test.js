var expect = require("./chai").expect;

exports.tests = function(GraphConstructor) {
  if (!GraphConstructor) {
    throw new Error("A GraphConstructor is required to run the base graph tests.");
  }

  describe("BaseGraph", function() {
    var g;

    beforeEach(function() {
      g = new GraphConstructor();
    });

    describe("initial graph state", function() {
      it("has no nodes", function() {
        expectEmptyGraph(g);
      });
    });

    describe("has", function() {
      it("returns false if the node is not in the graph", function() {
        expect(g.has("node-not-in-graph")).to.be.false;
      });
    });

    describe("get", function() {
      it("returns undefined if the node is not in the graph", function() {
        expect(g.get("node-not-in-graph")).to.be.undefined;
      });
    });

    describe("set", function() {
      it("creates the node if it isn't part of the graph", function() {
        var added;
        g._onAddNode = function(v) { added = v; };
        g.set("key", "label");
        expectSingleNodeGraph(g, "key", "label");
        expect(added).to.equal("key");
      });

      it("replaces the node's value if it is part of the graph", function() {
        var added;
        g.set("key", "old");
        g._onAddNode = function(v) { added = v; };
        g.set("key", "new");
        expectSingleNodeGraph(g, "key", "new");
        expect(added).to.be.undefined;
      });

      it("defaults the label to undefined", function() {
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

    describe("remove", function() {
      it("does nothing if the node is not part of the graph", function() {
        var removed;
        g._onRemoveNode = function(v) { removed = v; };
        g.remove("key");
        expectEmptyGraph(g);
        expect(removed).to.be.undefined;
      });

      it("removes the node if it is part of the graph", function() {
        var removed;
        g._onRemoveNode = function(v) { removed = v; };
        g.set("key", "label");
        g.remove("key");
        expectEmptyGraph(g);
        expect(removed).to.equal("key");
      });

      it("removes all incident in-edges", function() {
        g.setEdge("n1", "n2");
        g.remove("n2");
        expect(g.hasEdge("n1", "n2")).to.be.false;
        expect(g.graphEdgeCount).to.equal(0);
        expectSingleNodeGraph(g, "n1", undefined);
      });

      it("removes all incident out-edges", function() {
        g.setEdge("n1", "n2");
        g.remove("n1");
        expect(g.hasEdge("n1", "n2")).to.be.false;
        expect(g.graphEdgeCount).to.equal(0);
        expectSingleNodeGraph(g, "n2", undefined);
      });

      it("decrements edge count once when deleting a self-loop", function() {
        g.setEdge("n1", "n1");
        g.remove("n1");
        expect(g.graphEdgeCount).to.equal(0);
      });

      it("is chainable", function() {
        var g2 = g.remove("key");
        expect(g).to.equal(g2);
      });
    });

    describe("successors", function() {
      it("returns undefined if the node is not in the graph", function() {
        expect(g.successors("node-not-in-graph")).to.be.undefined;
      });
    });

    describe("predecessors", function() {
      it("returns undefined if the node is not in the graph", function() {
        expect(g.predecessors("node-not-in-graph")).to.be.undefined;
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
        expect(g.neighbors("node-not-in-graph")).to.be.undefined;
      });
    });

    describe("inEdges", function() {
      it("returns undefined if the node is not in the graph", function() {
        expect(g.inEdges("node-not-in-graph")).to.be.undefined;
      });

      it("does not allow changes through the returned edge object", function() {
        g.setEdge("n1", "n2", "label");
        var edge = g.inEdges("n2")[0];
        edge.label = "foo";
        expect(g.getEdge("n1", "n2")).to.equal("label");
      });
    });

    describe("outEdges", function() {
      it("returns undefined if the node is not in the graph", function() {
        expect(g.outEdges("node-not-in-graph")).to.be.undefined;
      });

      it("does not allow changes through the returned edge object", function() {
        g.setEdge("n1", "n2", "label");
        var edge = g.outEdges("n1")[0];
        edge.label = "foo";
        expect(g.getEdge("n1", "n2")).to.equal("label");
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
        g.set("n1");
        g.set("n2");
        g.removeEdge("n1", "n2");
        expect(g.graphEdgeCount).to.equal(0);
        expect(g.graphNodeCount).to.equal(2);

        g.removeEdge("n2", "n3");
        expect(g.graphEdgeCount).to.equal(0);
        expect(g.graphNodeCount).to.equal(2);

        g.removeEdge("n3", "n1");
        expect(g.graphEdgeCount).to.equal(0);
        expect(g.graphNodeCount).to.equal(2);
      });

      it("removes the edge if it is in the graph", function() {
        g.setEdge("n1", "n2");
        g.removeEdge("n1", "n2");
        expect(g.hasEdge("n1", "n2")).to.be.false;
        expect(g.graphEdgeCount).to.equal(0);
      });

      it("doesn't remove other edges incident on the nodes", function() {
        g.setEdge("n1", "n2");
        g.setEdge("n2", "n3");
        g.setEdge("n3", "n1");
        g.removeEdge("n1", "n2");
        expect(g.hasEdge("n1", "n2")).to.be.false;
        expect(g.graphEdgeCount).to.equal(2);
      });

      it("is chainable", function() {
        var g2 = g.removeEdge("n1", "n2");
        expect(g).to.equal(g2);
      });
    });

    describe("copy", function() {
      it("creates a shallow copy of the input graph", function() {
        g.set("n1", "label");

        var copy = g.copy();
        expect(copy.constructor).to.equal(g.constructor);
        expectSingleNodeGraph(g, "n1", "label");

        copy.set("n1", "new-label");
        expect(g.get("n1")).to.equal("label");
      });
    });
  });
};

function expectEmptyGraph(g) {
  expect(g.graphNodeIds()).to.be.empty;
  expect(g.graphNodeCount).to.equal(0);
  expect(g.graphEdges()).to.be.empty;
  expect(g.graphEdgeCount).to.equal(0);
}
exports.expectEmptyGraph = expectEmptyGraph;

function expectSingleNodeGraph(g, key, label) {
  expect(g.get(key)).to.equal(label);
  expect(g.has(key)).to.be.true;
  expect(g.graphNodeIds()).to.include(key);
  expect(g.graphNodeCount).to.equal(1);
}
exports.expectSingleNodeGraph = expectSingleNodeGraph;

function expectSingleEdgeGraph(g, v, w, label) {
  expect(g.graphEdges().length).to.equal(1);
  expect(g.getEdge(v, w)).to.equal(label);
  expect(g.hasEdge(v, w)).to.be.true;
  expect(g.graphEdgeCount).to.equal(1);
}
exports.expectSingleEdgeGraph = expectSingleEdgeGraph;
