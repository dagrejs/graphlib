var assert = require("./assert");

module.exports = function(name, Constructor, superName, SuperConstructor) {
  var g;

  beforeEach(function() {
    g = new Constructor();
  });

  describe("new " + name + "()", function() {
    it("has no nodes", function() {
      assert.equal(g.order(), 0);
      assert.lengthOf(g.nodes(), 0);
    });

    it("has no edges", function() {
      assert.equal(g.size(), 0);
      assert.lengthOf(g.edges(), 0);
    });
  });

  describe("parent", function() {
    it("throws if the object is not in the graph", function() {
      assert.throws(function() { g.parent("node-1"); });
    });

    it("defaults to null (root) for new nodes", function() {
      g.addNode(1);
      assert.isNull(g.parent(1));
    });

    it("throws an error for edges", function() {
      g.addNode(1);
      g.addEdge("A", 1, 1);
      assert.throws(function() { g.parent("A"); });
    });

    it("throws an error for a null or undefined parameter", function() {
      assert.throws(function() { g.parent(); });
      assert.throws(function() { g.parent(null); });
    });

    it("sets the parent with 2 arguments", function() {
      g.addNode(1);
      g.addNode("sg1");
      g.parent(1, "sg1");
      assert.equal(g.parent(1), "sg1");
      assert.lengthOf(g.children("sg1"), 1);
    });

    it("removes the current parent with 2 arguments", function() {
      g.addNode(1);
      g.addNode("sg1");
      g.parent(1, "sg1");
      assert.deepEqual(g.children(null), ["sg1"]);
    });

    it("sets the parent to root if it is null", function() {
      g.addNode(1);
      g.addNode("sg1");
      g.parent(1, "sg1");
      g.parent(1, null);
      assert.equal(g.parent(1), null);
      assert.lengthOf(g.children("sg1"), 0);
      assert.lengthOf(g.children(null), 2);
    });

    it("does not allow a node to be its own parent", function() {
      g.addNode("sg1");
      assert.throws(function() { g.parent("sg1", "sg1"); });
    });
  });

  describe("children", function() {
    it("returns an empty list for an empty subgraph", function() {
      g.addNode("sg1");
      assert.deepEqual(g.children("sg1"), []);
    });

    it("returns a list of all nodes in the root graph with the null parameter", function() {
      g.addNode(1);
      g.addEdge(2, 1, 1);
      assert.sameMembers(g.children(null), [1]);
    });
  });

  describe("delNode", function() {
    it("promotes children to the root when the subgraph was off the root", function() {
      g.addNode("sg1");
      g.addNode(1);
      g.parent(1, "sg1");
      g.delNode("sg1");
      assert.equal(g.parent(1), null);
    });

    it("promotes children to the parent of the subgraph", function() {
      g.addNode("sg1");
      g.addNode("sg2");
      g.addNode(1);
      g.parent("sg1", "sg2");
      g.parent(1, "sg1");
      g.delNode("sg1");
      assert.equal(g.parent(1), "sg2");
    });

    it("removes the parent information", function() {
      g.addNode("sg1");
      g.delNode("sg1");
      assert.throws(function() { g.parent("sg1"); });
    });

    it("removes the children information", function() {
      g.addNode("sg1");
      g.delNode("sg1");
      assert.throws(function() { g.children("sg1"); });
    });

    it("can remove a node created with a automatically assigned id", function() {
      var id = g.addNode();
      g.delNode(id);
      assert.lengthOf(g.nodes(), 0);
    });
  });

  describe("from" + superName, function() {
    var fromSuper = Constructor["from" + superName];

    it("returns a " + name, function() {
      var g = new SuperConstructor();
      assert.instanceOf(fromSuper(g), Constructor);
    });

    it("includes the graph value", function() {
      var g = new SuperConstructor();
      g.graph({a: "a-value"});
      assert.deepEqual(fromSuper(g).graph(), {a: "a-value"});
    });

    it("includes nodes from the source graph", function() {
      var g = new SuperConstructor();
      g.addNode(1);
      g.addNode(2);
      assert.sameMembers(fromSuper(g).nodes(), [1, 2]);
    });

    it("includes node attributes from the source graph", function() {
      var g = new SuperConstructor();
      g.addNode(1, {a: "a-value"});
      assert.deepEqual(fromSuper(g).node(1), {a: "a-value"});
    });

    it("includes edges from the source graph", function() {
      var g = new SuperConstructor();
      g.addNode(1);
      var edgeId = g.addEdge(null, 1, 1);
      assert.sameMembers(fromSuper(g).edges(), [edgeId]);
    });

    it("includes edge attributes from the source graph", function() {
      var g = new SuperConstructor();
      g.addNode(1);
      var edgeId = g.addEdge(null, 1, 1, {a: "a-value"});
      assert.deepEqual(fromSuper(g).edge(edgeId), {a: "a-value"});
    });

    it("has the same incidentNodes for edges from the source graph", function() {
      var g = new SuperConstructor();
      g.addNode(1);
      g.addNode(2);
      var edgeId = g.addEdge(null, 1, 2);
      assert.deepEqual(fromSuper(g).incidentNodes(edgeId), [1, 2]);
    });
  });
};
