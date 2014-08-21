var expect = require("./chai").expect,
    _ = require("lodash");

var nodeBehavior = require("../lib/node-behavior");

describe("nodeBehavior", function() {
  var g;

  beforeEach(function() {
    g = {};
    _.extend(g, nodeBehavior);
    g._nodes = {};
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

    it("is chainable", function() {
      var g2 = g.remove("key");
      expect(g).to.equal(g2);
    });
  });

  describe("_copyTo", function() {
    it("creates a shallow copy of the input graph", function() {
      g.set("n1", "label");

      var copy = {};
      _.extend(copy, nodeBehavior);
      g._copyTo(copy);
      expectSingleNodeGraph(g, "n1", "label");

      copy.set("n1", "new-label");
      expect(g.get("n1")).to.equal("label");
    });
  });
});

function expectEmptyGraph(g) {
  expect(g.nodeIds()).to.be.empty;
  expect(g.numNodes()).to.equal(0);
}

function expectSingleNodeGraph(g, key, label) {
  expect(g.get(key)).to.equal(label);
  expect(g.has(key)).to.be.true;
  expect(g.nodeIds()).to.include(key);
  expect(g.numNodes()).to.equal(1);
}
