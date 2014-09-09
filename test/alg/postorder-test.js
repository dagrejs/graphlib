var _ = require("lodash"),
    expect = require("../chai").expect,
    Graph = require("../..").Graph,
    postorder = require("../..").alg.postorder;

describe("alg.postorder", function() {
  it("returns the root for a singleton graph", function() {
    var g = new Graph();
    g.node("a");
    expect(postorder(g, "a")).to.eql(["a"]);
  });

  it("visits each node in the graph once", function() {
    var g = new Graph();
    g.path("a", "b", "d", "e");
    g.path("a", "c", "d", "e");

    var nodes = postorder(g, "a");
    expect(_.sortBy(nodes)).to.eql(["a", "b", "c", "d", "e"]);
  });

  it("works for a tree", function() {
    var g = new Graph();
    g.edge("a", "b");
    g.path("a", "c", "d");
    g.edge("c", "e");

    var nodes = postorder(g, "a");
    expect(_.sortBy(nodes)).to.eql(["a", "b", "c", "d", "e"]);
    expect(nodes.indexOf("b")).to.be.lt(nodes.indexOf("a"));
    expect(nodes.indexOf("c")).to.be.lt(nodes.indexOf("a"));
    expect(nodes.indexOf("d")).to.be.lt(nodes.indexOf("c"));
    expect(nodes.indexOf("e")).to.be.lt(nodes.indexOf("c"));
  });

  it("works for an array of roots", function() {
    var g = new Graph();
    g.edge("a", "b");
    g.edge("c", "d");
    g.node("e");
    g.node("f");

    var nodes = postorder(g, ["a", "b", "c", "e"]);
    expect(_.sortBy(nodes)).to.eql(["a", "b", "c", "d", "e"]);
    expect(nodes.indexOf("b")).to.be.lt(nodes.indexOf("a"));
    expect(nodes.indexOf("d")).to.be.lt(nodes.indexOf("c"));
  });

  it("fails if root is not in the graph", function() {
    var g = new Graph();
    g.node("a");
    expect(function() { postorder(g, "b"); }).to.throw();
  });
});
