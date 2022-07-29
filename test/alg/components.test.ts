import { Graph } from "../../lib/graph";
import { expect } from "chai";
import { components } from "../../lib/alg/components";

describe("alg.components", function() {
  it("returns an empty list for an empty graph", function() {
    expect(components(new Graph({ directed: false }))).to.be.empty;
  });

  it("returns singleton lists for unconnected nodes", function() {
    var g = new Graph({ directed: false });
    g.setNode("a");
    g.setNode("b");

    var result = components(g).sort((a, b) => a[0].localeCompare(b[0]));
    expect(result).to.eql([["a"], ["b"]]);
  });

  it("returns a list of nodes in a component", function() {
    var g = new Graph({ directed: false });
    g.setEdge("a", "b");
    g.setEdge("b", "c");

    var result = components(g).map(xs => xs.sort());
    expect(result).to.eql([["a", "b", "c"]]);
  });

  it("returns nodes connected by a neighbor relationship in a digraph", function() {
    var g = new Graph();
    g.setPath(["a", "b", "c", "a"]);
    g.setEdge("d", "c");
    g.setEdge("e", "f");

    var result = components(g).map(xs => xs.sort()).sort((a, b) => a[0].localeCompare(b[0]));
    expect(result).to.eql([["a", "b", "c", "d"], ["e", "f"]]);
  });
});
