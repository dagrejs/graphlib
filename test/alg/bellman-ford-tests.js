var expect = require("../chai").expect;

var Graph = require("../..").Graph,
    bellmanFord = require("../..").alg.bellmanFord;

describe("alg.bellmanFord", function(){
  it("Assigns distance 0 for the source node", function() {
    var g = new Graph();
    g.setNode("source");
    expect(bellmanFord(g, "source")).to.eql({ source: { distance: 0 } });
  });

  it("Returns Number.POSITIVE_INFINITY for unconnected nodes", function() {
    var g = new Graph();
    g.setNode("a");
    g.setNode("b");
    expect(bellmanFord(g, "a")).to.eql({
      a: { distance: 0 },
      b: { distance: Number.POSITIVE_INFINITY }
    });
  });

  it("Returns the distance and predecessor for all nodes", function() {
    var g = new Graph();
    g.setPath(["a", "b", "c"]);
    g.setEdge("b", "d");
    expect(bellmanFord(g, "a")).to.eql({
      a: { distance: 0 },
      b: { distance: 1, predecessor: "a" },
      c: { distance: 2, predecessor: "b" },
      d: { distance: 2, predecessor: "b" }
    });
  });

  it("Works for undirected graphs", function() {
    var g = new Graph({ directed: false });
    g.setPath(["a", "b", "c"]);
    g.setEdge("b", "d");
    expect(bellmanFord(g, "a")).to.eql({
      a: { distance: 0 },
      b: { distance: 1, predecessor: "a" },
      c: { distance: 2, predecessor: "b" },
      d: { distance: 2, predecessor: "b" }
    });
  });

  it("Works with an optionally supplied weight function", function() {
    var g = new Graph();
    g.setEdge("a", "b", 1);
    g.setEdge("a", "c", 2);
    g.setEdge("b", "d", 3);
    g.setEdge("c", "d", 3);

    expect(bellmanFord(g, "a", weightFn(g))).to.eql({
      a: { distance: 0 },
      b: { distance: 1, predecessor: "a" },
      c: { distance: 2, predecessor: "a" },
      d: { distance: 4, predecessor: "b" }
    });
  });

  it("Uses an optionally supplied edge function", function() {
    var g = new Graph();
    g.setPath(["a", "c", "d"]);
    g.setEdge("b", "c");

    function edgeFn(v){
      switch (v) {
        case "d": return [{ v: "d", w: "c" }];
        case "c": return [{ v: "c", w: "b" }, { v: "c", w: "a" }];
        default: return [];
      }
    }

    expect(bellmanFord(g, "d", undefined, edgeFn)).to.eql({
      a: { distance: 2, predecessor: "c" },
      b: { distance: 2, predecessor: "c" },
      c: { distance: 1, predecessor: "d" },
      d: { distance: 0 }
    });
  });

  it("Works with negative weight edges on the graph", function() {
    var g = new Graph();
    g.setEdge("a", "b", -1);
    g.setEdge("a", "c", 4);
    g.setEdge("b", "c", 3);
    g.setEdge("b", "d", 2);
    g.setEdge("b", "e", 2);
    g.setEdge("d", "c", 5);
    g.setEdge("d", "b", 1);
    g.setEdge("e", "d", -3);

    expect(bellmanFord(g, "a", weightFn(g))).to.eql({
      a: { distance: 0 },
      b: { distance: -1, predecessor: "a" },
      c: { distance: 2, predecessor: "b" },
      d: { distance: -2, predecessor: "e" },
      e: { distance: 1, predecessor: "b" }
    });
  });

  it("Throws an error if the graph contains a negative weight cycle", function() {
    var g = new Graph();
    g.setEdge("a", "b", 1);
    g.setEdge("b", "c", 3);
    g.setEdge("c", "d", -5);
    g.setEdge("d", "e", 4);
    g.setEdge("d", "b", 1);
    g.setEdge("c", "f", 8);

    expect(function() { bellmanFord(g, "a", weightFn(g)); } ).to.throw();
  });
});


function weightFn(g) {
  return function(e) {
    return g.edge(e);
  };
}
