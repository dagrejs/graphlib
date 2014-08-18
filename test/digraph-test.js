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
    });
  });

  describe("set", function() {
    it("creates the node if it isn't part of the graph", function() {
      g.set("key", "label");
      expectSingletonGraph(g, "key", "label");
    });

    it("replaces the node's value if it is part of the graph", function() {
      g.set("key", "old");
      g.set("key", "new");
      expectSingletonGraph(g, "key", "new");
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
      expectSingletonGraph(g, "key", undefined + "-new");
    });

    it("replaces the node's value if it is part of the graph", function() {
      g.set("key", "label");
      g.update("key", updater);
      expectSingletonGraph(g, "key", "label-new");
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

    it("is chainable", function() {
      var g2 = g.delete("key");
      expect(g).to.equal(g2);
    });
  });
});

function expectEmptyGraph(g) {
  expect(g.nodes()).to.be.empty;
  expect(g.numNodes()).to.equal(0);
  expect(g.nodeIds()).to.be.empty;
}

function expectSingletonGraph(g, key, label) {
  expect(g.nodeIds()).to.include(key);
  expect(g.get(key)).to.equal(label);
  expect(g.has(key)).to.be.true;
  expect(g.numNodes()).to.equal(1);
}
