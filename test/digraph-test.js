var expect = require("./chai").expect;

var Digraph = require("..").Digraph;

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

  describe("node", function() {
    describe("mutation", function() {
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

      describe("query", function() {
        describe("successors", function() {
          it("returns the successors of a node", function() {
            g.setEdge("n1", "n1");
            g.setEdge("n1", "n2");
            g.setEdge("n2", "n3");
            g.setEdge("n3", "n1");
            expect(g.successors("n1").sort()).to.eql(["n1", "n2"]);
          });

          it("returns undefined if the node is not in the graph", function() {
            expect(g.successors("n1")).to.be.undefined;
          });
        });

        describe("predecessors", function() {
          it("returns the predecessors of a node", function() {
            g.setEdge("n1", "n1");
            g.setEdge("n1", "n2");
            g.setEdge("n2", "n3");
            g.setEdge("n3", "n1");
            expect(g.predecessors("n1").sort()).to.eql(["n1", "n3"]);
          });

          it("returns undefined if the node is not in the graph", function() {
            expect(g.predecessors("n1")).to.be.undefined;
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

        describe("sources", function() {
          it("returns the nodes in the graph with no in edges", function() {
            g.setEdge("n1", "n2");
            g.setEdge("n2", "n3");
            g.setEdge("n4", "n3");
            g.set("n5");
            expect(g.sources().sort()).to.eql(["n1", "n4", "n5"]);
          });
        });

        describe("sinks", function() {
          it("returns the nodes in the graph with no out edges", function() {
            g.setEdge("n1", "n2");
            g.setEdge("n3", "n2");
            g.setEdge("n3", "n4");
            g.set("n5");
            expect(g.sinks().sort()).to.eql(["n2", "n4", "n5"]);
          });
        });
      });
    });
  });

  describe("edge", function() {
    describe("mutation", function() {
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

    describe("query", function() {
      describe("inEdges", function() {
        it("returns the edges that point at the specified node", function() {
          g.setEdge("n1", "n2", "n1n2");
          g.setEdge("n3", "n2", "n3n2");
          g.setEdge("n3", "n4");
          var edges = sortEdges(g.inEdges("n2"));
          expect(edges).to.eql([{ v: "n1", w: "n2", label: "n1n2" },
                                { v: "n3", w: "n2", label: "n3n2" }]);
        });

        it("returns undefined if the node is not in the graph", function() {
          expect(g.inEdges("n1")).to.be.undefined;
        });

        it("does not allow changes to the graph through the returned edge object", function() {
          g.setEdge("n1", "n2", "label");
          var edge = g.inEdges("n2")[0];
          edge.label = "foo";
          expect(g.getEdge("n1", "n2")).to.equal("label");
        });
      });

      describe("outEdges", function() {
        it("returns the edges that start at the specified node", function() {
          g.setEdge("n1", "n2", "n1n2");
          g.setEdge("n1", "n3", "n1n3");
          g.setEdge("n2", "n3", "n2n3");
          var edges = sortEdges(g.outEdges("n1"));
          expect(edges).to.eql([{ v: "n1", w: "n2", label: "n1n2" },
                                { v: "n1", w: "n3", label: "n1n3" }]);
        });

        it("returns undefined if the node is not in the graph", function() {
          expect(g.outEdges("n1")).to.be.undefined;
        });

        it("does not allow changes to the graph through the returned edge object", function() {
          g.setEdge("n1", "n2", "label");
          var edge = g.outEdges("n1")[0];
          edge.label = "foo";
          expect(g.getEdge("n1", "n2")).to.equal("label");
        });
      });
    });
  });

  describe("copy", function() {
    it("creates a shallow copy of the input graph", function() {
      g.set("n1", "label");
      g.setEdge("n2", "n3", "n2n3");

      var copy = g.copy();
      expect(copy.numNodes()).to.equal(3);
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
  expect(g.nodeIds()).to.be.empty;
  expect(g.numNodes()).to.equal(0);
  expect(g.edges()).to.be.empty;
  expect(g.numEdges()).to.equal(0);
}

function expectSingleNodeGraph(g, key, label) {
  expect(g.nodeIds()).to.include(key);
  expect(g.get(key)).to.equal(label);
  expect(g.has(key)).to.be.true;
  expect(g.numNodes()).to.equal(1);
}

function expectSingleEdgeGraph(g, v, w, label) {
  expect(g.edges()).to.eql([{ v: v, w: w, label: label }]);
  expect(g.getEdge(v, w)).to.equal(label);
  expect(g.hasEdge(v, w)).to.be.true;
  expect(g.numEdges()).to.equal(1);
  if (v !== w) {
    expect(g.sources()).to.include(v);
    expect(g.sources()).to.not.include(w);
    expect(g.sinks()).to.include(w);
    expect(g.sinks()).to.not.include(v);
  }
}

function sortEdges(edges) {
  return edges.sort(function(e1, e2) {
    if (e1.v < e2.v) return -1;
    if (e1.v > e2.v) return 1;
    return 0;
  });
}
