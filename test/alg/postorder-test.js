var _ = require("lodash"),
    expect = require("../chai").expect,
    Graph = require("../..").Graph,
    Digraph = require("../..").Digraph,
    CDigraph = require("../..").CDigraph,
    postorder = require("../..").alg.postorder;

describe("alg.postorder", function() {
  it("returns the root for a singleton graph", function() {
    var g = new Graph();
    g.setNode("a");
    expect(postorder(g, "a")).to.eql(["a"]);
  });

  it("visits each node in the graph once", function() {
    var g = new Digraph();
    g.setPath(["a", "b", "d", "e"]);
    g.setPath(["a", "c", "d", "e"]);

    var nodes = postorder(g, "a");
    expect(_.sortBy(nodes)).to.eql(["a", "b", "c", "d", "e"]);
  });

  it("works for an undirected tree", function() {
    var g = new Graph();
    g.setEdge("a", "b");
    g.setPath(["a", "c", "d"]);
    g.setEdge("c", "e");

    var nodes = postorder(g, "a");
    expect(_.sortBy(nodes)).to.eql(["a", "b", "c", "d", "e"]);
    expect(nodes.indexOf("b")).to.be.lt(nodes.indexOf("a"));
    expect(nodes.indexOf("c")).to.be.lt(nodes.indexOf("a"));
    expect(nodes.indexOf("d")).to.be.lt(nodes.indexOf("c"));
    expect(nodes.indexOf("e")).to.be.lt(nodes.indexOf("c"));
  });

  it("works for a directed tree", function() {
    var g = new Digraph();
    g.setEdge("a", "b");
    g.setPath(["a", "c", "d"]);
    g.setEdge("c", "e");

    var nodes = postorder(g, "a");
    expect(_.sortBy(nodes)).to.eql(["a", "b", "c", "d", "e"]);
    expect(nodes.indexOf("b")).to.be.lt(nodes.indexOf("a"));
    expect(nodes.indexOf("c")).to.be.lt(nodes.indexOf("a"));
    expect(nodes.indexOf("d")).to.be.lt(nodes.indexOf("c"));
    expect(nodes.indexOf("e")).to.be.lt(nodes.indexOf("c"));
  });

  it("works for a directed diamond", function() {
    var g = new Digraph();
    g.setPath(["a", "b", "d"]);
    g.setPath(["a", "c", "d"]);

    var nodes = postorder(g, "a");
    expect(_.sortBy(nodes)).to.eql(["a", "b", "c", "d"]);
    expect(nodes.indexOf("b")).to.be.lt(nodes.indexOf("a"));
    expect(nodes.indexOf("c")).to.be.lt(nodes.indexOf("a"));
    expect(nodes.indexOf("d")).to.be.lt(
        Math.min(nodes.indexOf("b"), nodes.indexOf("c")));
  });

  it("works for an array of roots", function() {
    var g = new Digraph();
    g.setEdge("a", "b");
    g.setEdge("c", "d");
    g.setNode("e");
    g.setNode("f");

    var nodes = postorder(g, ["a", "c", "e"]);
    expect(_.sortBy(nodes)).to.eql(["a", "b", "c", "d", "e"]);
    expect(nodes.indexOf("b")).to.be.lt(nodes.indexOf("a"));
    expect(nodes.indexOf("d")).to.be.lt(nodes.indexOf("c"));
  });

  it("finishes early if the callback returns false", function() {
    var g = new Digraph();
    g.setPath(["a", "b", "c", "d"]);

    var nodes = postorder(g, "a", function(v) {
      return v !== "c";
    });

    expect(_.sortBy(nodes)).to.eql(["a", "b"]);
    expect(nodes.indexOf("b")).to.be.lt(nodes.indexOf("a"));
  });

  it("ends the branch if callback returns null", function() {
    var g = new Digraph();
    g.setEdge("a", "b");
    g.setPath(["a", "c", "d"]);
    g.setPath(["a", "f", "e"]);

    var nodes = postorder(g, "a", function(v) {
      return v !== "d" || null;
    });

    expect(_.sortBy(nodes)).to.eql(["a", "b", "c", "e", "f"]);
    expect(nodes.indexOf("b")).to.be.lt(nodes.indexOf("a"));
    expect(nodes.indexOf("c")).to.be.lt(nodes.indexOf("a"));
    expect(nodes.indexOf("f")).to.be.lt(nodes.indexOf("a"));
    expect(nodes.indexOf("e")).to.be.lt(nodes.indexOf("f"));
  });

  it("uses a supplied successors function", function() {
    var g = new CDigraph();
    g.setParent("a", "root");
    g.setParent("a1", "a");
    g.setParent("a2", "a");
    g.setParent("b", "root");

    var nodes = postorder(g, "root", undefined, g.getChildren.bind(g));
    expect(_.sortBy(nodes)).to.eql(["a", "a1", "a2", "b", "root"]);
    expect(nodes.indexOf("a")).to.be.lt(nodes.indexOf("root"));
    expect(nodes.indexOf("a1")).to.be.lt(nodes.indexOf("a"));
    expect(nodes.indexOf("a2")).to.be.lt(nodes.indexOf("a"));
    expect(nodes.indexOf("b")).to.be.lt(nodes.indexOf("root"));
  });

  it("fails if root is not in the graph", function() {
    var g = new Graph();
    g.setNode("a");
    expect(function() { postorder(g, "b"); }).to.throw();
  });
});
