var expect = require("../chai").expect,
    Graph = require("../..").Graph,
    dijkstraAll = require("../..").alg.dijkstraAll,
    allShortestPathsTest = require("./all-shortest-paths-test");

describe("alg.dijkstraAll", function() {
  allShortestPathsTest.tests(dijkstraAll);

  it("throws an Error if it encounters a negative edge weight", function() {
    var g = new Graph();
    g.edge("a", "b").weight =  1;
    g.edge("a", "c").weight = -2;
    g.edge("b", "d").weight =  3;
    g.edge("c", "d").weight =  3;

    expect(function() { dijkstraAll(g, weight(g)); }).to.throw();
  });
});

function weight(g) {
  return function(e) {
    return g.edge(e).weight;
  };
}
