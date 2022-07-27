import * as allShortestPathsTest from "./all-shortest-paths-test";
import { Graph } from "../../lib/graph";
import { expect } from "chai";
import { dijkstraAll } from "../../lib/alg/dijkstra-all";

describe("alg.dijkstraAll", function() {
  allShortestPathsTest.tests(dijkstraAll);

  it("throws an Error if it encounters a negative edge weight", function() {
    var g = new Graph();
    g.setEdge("a", "b",  1);
    g.setEdge("a", "c", -2);
    g.setEdge("b", "d",  3);
    g.setEdge("c", "d",  3);

    expect(function() { dijkstraAll(g, weight(g)); }).to.throw();
  });
});

function weight(g) {
  return function(e) {
    return g.edge(e);
  };
}
