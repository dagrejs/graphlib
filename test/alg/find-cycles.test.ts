import { Graph } from "../../lib/graph";
import { expect } from "chai";
import { findCycles } from "../../lib/alg/find-cycles";

describe("alg.findCycles", function() {
  it("returns an empty array for an empty graph", function() {
    expect(findCycles(new Graph())).to.eql([]);
  });

  it("returns an empty array if the graph has no cycles", function() {
    var g = new Graph();
    g.setPath(["a", "b", "c"]);
    expect(findCycles(g)).to.eql([]);
  });

  it("returns a single entry for a cycle of 1 node", function() {
    var g = new Graph();
    g.setPath(["a", "a"]);
    expect(sort(findCycles(g))).to.eql([["a"]]);
  });

  it("returns a single entry for a cycle of 2 nodes", function() {
    var g = new Graph();
    g.setPath(["a", "b", "a"]);
    expect(sort(findCycles(g))).to.eql([["a", "b"]]);
  });

  it("returns a single entry for a triangle", function() {
    var g = new Graph();
    g.setPath(["a", "b", "c", "a"]);
    expect(sort(findCycles(g))).to.eql([["a", "b", "c"]]);
  });

  it("returns multiple entries for multiple cycles", function() {
    var g = new Graph();
    g.setPath(["a", "b", "a"]);
    g.setPath(["c", "d", "e", "c"]);
    g.setPath(["f", "g", "g"]);
    g.setNode("h");
    expect(sort(findCycles(g))).to.eql([["a", "b"], ["c", "d", "e"], ["g"]]);
  });
});

// A helper that sorts components and their contents
function sort(cmpts: string[][]) {
  return cmpts.map(cmpt => cmpt.sort()).sort((a, b) => a[0].localeCompare(b[0]));
}
