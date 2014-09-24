var _ = require("lodash"),
    expect = require("../chai").expect,
    Graph = require("../..").Graph,
    prim = require("../..").alg.prim;

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
    expect(_.sortBy(g.neighbors("a"))).to.eql(["b"]);
    expect(_.sortBy(g.neighbors("b"))).to.eql(["a", "c", "d"]);
    expect(_.sortBy(g.neighbors("c"))).to.eql(["b"]);
    expect(_.sortBy(g.neighbors("d"))).to.eql(["b", "e"]);
    expect(_.sortBy(g.neighbors("e"))).to.eql(["d"]);
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
