var _ = require("lodash"),
    expect = require("../chai").expect,
    Graph = require("../..").Graph,
    postorder = require("../..").alg.postorder;

describe("alg.postorder", function() {
  it("returns the root for a singleton graph", function() {
    var g = new Graph();
    g.setNode("a");
    expect(postorder(g, "a")).to.eql(["a"]);
  });

  it("visits each node in the graph once", function() {
    var g = new Graph();
    g.setPath(["a", "b", "d", "e"]);
    g.setPath(["a", "c", "d", "e"]);

    var nodes = postorder(g, "a");
    expect(_.sortBy(nodes)).to.eql(["a", "b", "c", "d", "e"]);
  });

  it("works for a tree", function() {
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

  it("works for an array of roots", function() {
    var g = new Graph();
    g.setEdge("a", "b");
    g.setEdge("c", "d");
    g.setNode("e");
    g.setNode("f");

    var nodes = postorder(g, ["a", "b", "c", "e"]);
    expect(_.sortBy(nodes)).to.eql(["a", "b", "c", "d", "e"]);
    expect(nodes.indexOf("b")).to.be.lt(nodes.indexOf("a"));
    expect(nodes.indexOf("d")).to.be.lt(nodes.indexOf("c"));
  });

  it("works for multiple connected roots", function() {
    var g = new Graph();
    g.setEdge("a", "b");
    g.setEdge("a", "c");
    g.setEdge("d", "c");

    var nodes = postorder(g, ["a", "d"]);
    expect(_.sortBy(nodes)).to.eql(["a", "b", "c", "d"]);
    expect(nodes.indexOf("b")).to.be.lt(nodes.indexOf("a"));
    expect(nodes.indexOf("c")).to.be.lt(nodes.indexOf("a"));
    expect(nodes.indexOf("c")).to.be.lt(nodes.indexOf("d"));
  });

  it("fails if root is not in the graph", function() {
    var g = new Graph();
    g.setNode("a");
    expect(function() { postorder(g, "b"); }).to.throw();
  });
});
