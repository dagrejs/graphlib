var expect = require("../chai").expect,
    Digraph = require("../..").Digraph,
    dijkstraAll = require("../..").alg.dijkstraAll,
    util = require("../..").util,
    allShortestPathsTest = require("./all-shortest-paths-test");

describe("alg.dijkstraAll", function() {
  allShortestPathsTest.tests(dijkstraAll);

  it("throws an Error if it encounters a negative edge weight", function() {
    var g = new Digraph();
    g.setEdge("a", "b", 1);
    g.setEdge("a", "c", -2);
    g.setEdge("b", "d", 3);
    g.setEdge("c", "d", 3);

    expect(function() { dijkstraAll(g, util.LABEL_WEIGHT_FUNC); }).to.throw();
  });
});
