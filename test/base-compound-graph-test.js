var _ = require("lodash"),
    expect = require("./chai").expect;

exports.tests = tests;

function tests(GraphConstructor) {
  describe("BaseCompountGraph", function() {
    var g;

    beforeEach(function() {
      g = new GraphConstructor();
    });

    describe("getParent", function() {
      it("defaults to undefined", function() {
        g.setNode("n1");
        expect(g.getParent("n1")).to.be.undefined;
      });
    });

    describe("getChildren", function() {
      it("defaults to an empty list", function() {
        g.setNode("n1");
        expect(g.getChildren("n1")).to.eql([]);
      });

      it("returns undefined if the node is not in the graph", function() {
        expect(g.getChildren("n1")).to.be.undefined;
      });

      it("returns all sources for the root (undefined)", function() {
        g.setNode("n1");
        g.setNode("n2");
        expect(_.sortBy(g.getChildren())).to.eql(["n1", "n2"]);
        expect(_.sortBy(g.getChildren(undefined))).to.eql(["n1", "n2"]);
      });
    });

    describe("setParent", function() {
      it("sets the parent for a node", function() {
        g.setNode("parent");
        g.setNode("n1");
        g.setParent("n1", "parent");
        expect(g.getParent("n1")).to.equal("parent");
      });

      it("creates the child if it does not exist", function() {
        g.setNode("parent");
        g.setParent("n1", "parent");
        expect(g.hasNode("n1")).to.be.true;
        expect(g.getParent("n1")).to.equal("parent");
      });

      it("creates the parent if it does not exist", function() {
        g.setNode("n1");
        g.setParent("n1", "parent");
        expect(g.hasNode("parent")).to.be.true;
        expect(g.getParent("n1")).to.equal("parent");
      });

      it("does not allow a cycle in the nesting tree", function() {
        g.setParent("b", "a");
        expect(function() { g.setParent("a", "b"); }).to.throw();
      });

      it("does not allow a node to be its own paernt", function() {
        expect(function() { g.setParent("a", "a"); }).to.throw();
      });
    });

    describe("removeNode", function() {
      it("removes all children of the node", function() {
        g.setParent("n1", "root");
        g.setParent("n2", "n1");
        g.setParent("n3", "n2");
        g.setParent("n4", "n1");
        g.setParent("other", "root");
        g.removeNode("n1");

        expect(g.hasNode("n1")).to.be.false;
        expect(g.hasNode("n2")).to.be.false;
        expect(g.hasNode("n3")).to.be.false;
        expect(g.hasNode("n4")).to.be.false;
        expect(g.hasNode("root")).to.be.true;
        expect(g.hasNode("other")).to.be.true;
      });
    });

    describe("getNestingTree", function() {
      it("returns an empty graph if the graph is empty", function() {
        expect(g.getNestingTree().nodeCount()).to.equal(0);
      });

      it("returns all nodes as sources in a flat graph", function() {
        g.setNode("n1");
        g.setNode("n2");

        var nestingTree = g.getNestingTree();
        expect(_.sortBy(nestingTree.sources())).to.eql(["n1", "n2"]);
      });

      it("returns the hierarchy for nested graphs", function() {
        g.setParent("n1-1", "root");
        g.setParent("n1-2", "root");
        g.setParent("n2", "n1-1");

        var nestingTree = g.getNestingTree();
        expect(nestingTree.sources()).to.eql(["root"]);
        expect(_.sortBy(nestingTree.successors("root"))).to.eql(["n1-1", "n1-2"]);
        expect(nestingTree.successors("n1-1")).to.eql(["n2"]);
      });

      it("does not allow changes to the original graph", function() {
        g.setParent("n1", "root");

        var nestingTree = g.getNestingTree();
        nestingTree.removeEdge("root", "n1");
        nestingTree.setEdge("n1", "root");

        expect(g.getChildren()).to.eql(["root"]);
        expect(g.getChildren("root")).to.eql(["n1"]);
      });
    });
  });
}
