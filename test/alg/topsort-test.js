var expect = require("../chai").expect,
    _ = require("lodash");

var Digraph = require("../..").Digraph,
    Graph = require("../..").Graph,
    topsort = require("../..").alg.topsort;

describe("alg.topsort", function() {
  it("returns an empty array for an empty graph", function() {
    expect(topsort(new Digraph())).to.be.empty;
  });

  it("sorts nodes such that earlier nodes have directed edges to later nodes", function() {
    var g = new Digraph();
    g.setPath(["b", "c", "a"]);
    expect(topsort(g)).to.eql(["b", "c", "a"]);
  });

  it("works for a diamond", function() {
    var g = new Digraph();
    g.setPath(["a", "b", "d"]);
    g.setPath(["a", "c", "d"]);

    var result = topsort(g);
    expect(_.indexOf(result, "a")).to.equal(0);
    expect(_.indexOf(result, "b")).to.be.lt(_.indexOf(result, "d"));
    expect(_.indexOf(result, "c")).to.be.lt(_.indexOf(result, "d"));
    expect(_.indexOf(result, "d")).to.equal(3);
  });

  it("throws CycleException if there is a cycle #1", function() {
    var g = new Digraph();
    g.setPath(["b", "c", "a", "b"]);
    expect(function() { topsort(g); }).to.throw(topsort.CycleException);
  });

  it("throws CycleException if there is a cycle #2", function() {
    var g = new Digraph();
    g.setPath(["b", "c", "a", "b"]);
    g.setEdge("b", "d");
    expect(function() { topsort(g); }).to.throw(topsort.CycleException);
  });

  it("throws CycleException if there is a cycle #3", function() {
    var g = new Digraph();
    g.setPath(["b", "c", "a", "b"]);
    g.setNode("d");
    expect(function() { topsort(g); }).to.throw(topsort.CycleException);
  });

  it("throws CycleException if an undirected graph has at least one edge", function() {
    var g = new Graph();
    g.setEdge("a", "b");
    expect(function() { topsort(g); }).to.throw(topsort.CycleException);
  });

  it("returns unsorted nodes for an undirected graph with no edges", function() {
    var g = new Graph();
    g.setNodes(["a", "b", "c"]);
    expect(topsort(g).sort()).to.eql(["a", "b", "c"]);
  });
});
