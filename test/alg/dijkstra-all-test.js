var expect = require("../chai").expect;

var Digraph = require("../..").Digraph,
    util = require("../..").util,
    dijkstraAll = require("../..").alg.dijkstraAll;

describe("alg.dijkstraAll", function() {
  // Note: these tests are mostly for sanity. Since we delegate to dijkstra
  // we already have pretty complete test coverage.

  it("returns 0 for the node itself", function() {
    var g = new Digraph();
    g.set("a");
    expect(dijkstraAll(g)).to.eql({ a: { a: { distance: 0 } }});
  });

  it("returns the distance and path from all nodes to other nodes", function() {
    var g = new Digraph();
    g.setEdge("a", "b");
    g.setEdge("b", "c");
    expect(dijkstraAll(g)).to.eql({
      a: {
        a: { distance: 0 },
        b: { distance: 1, predecessor: "a" },
        c: { distance: 2, predecessor: "b" }
      },
      b: {
        a: { distance: Number.POSITIVE_INFINITY },
        b: { distance: 0 },
        c: { distance: 1, predecessor: "b" }
      },
      c: {
        a: { distance: Number.POSITIVE_INFINITY },
        b: { distance: Number.POSITIVE_INFINITY },
        c: { distance: 0 }
      }
    });
  });

  it("throws an Error if it encounters a negative edge weight", function() {
    var g = new Digraph();
    g.setEdge("a", "b", 1);
    g.setEdge("a", "c", -2);
    g.setEdge("b", "d", 3);
    g.setEdge("c", "d", 3);

    expect(function() { dijkstraAll(g, util.LABEL_WEIGHT_FUNC); }).to.throw();
  });
});
