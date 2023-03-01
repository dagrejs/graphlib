var expect = require("../chai").expect;
var Graph = require("../..").Graph;
var prim = require("../..").alg.prim;

describe("alg.prim", function() {
  it("returns an empty graph for an empty input", function() {
    var source = new Graph();

    var g = prim(source, weightFn(source));
    expect(g.nodeCount()).to.equal(0);
    expect(g.edgeCount()).to.equal(0);
  });

  it("returns a single node graph for a graph with a single node", function() {
    var source = new Graph();
    source.setNode("a");

    var g = prim(source, weightFn(source));
    expect(g.nodes()).to.eql(["a"]);
    expect(g.edgeCount()).to.equal(0);
  });

  it("returns a deterministic result given an optimal solution", function() {
    var source = new Graph();
    source.setEdge("a", "b",  1);
    source.setEdge("b", "c",  2);
    source.setEdge("b", "d",  3);
    // This edge should not be in the min spanning tree
    source.setEdge("c", "d", 20);
    // This edge should not be in the min spanning tree
    source.setEdge("c", "e", 60);
    source.setEdge("d", "e",  1);

    var g = prim(source, weightFn(source));
    expect(g.neighbors("a").sort()).to.eql(["b"]);
    expect(g.neighbors("b").sort()).to.eql(["a", "c", "d"]);
    expect(g.neighbors("c").sort()).to.eql(["b"]);
    expect(g.neighbors("d").sort()).to.eql(["b", "e"]);
    expect(g.neighbors("e").sort()).to.eql(["d"]);
  });

  it("throws an Error for unconnected graphs", function() {
    var source = new Graph();
    source.setNode("a");
    source.setNode("b");

    expect(function() { prim(source, weightFn(source)); }).to.throw();
  });
});

function weightFn(g) {
  return function(edge) {
    return g.edge(edge);
  };
}
