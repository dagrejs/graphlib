import { Graph } from "../../lib/graph";
import { expect } from "chai";
import { topsort, CycleException } from "../../lib/alg/topsort";

describe("alg.topsort", function() {
  it("returns an empty array for an empty graph", function() {
    expect(topsort(new Graph())).to.be.empty;
  });

  it("sorts nodes such that earlier nodes have directed edges to later nodes", function() {
    var g = new Graph();
    g.setPath(["b", "c", "a"]);
    expect(topsort(g)).to.eql(["b", "c", "a"]);
  });

  it("works for a diamond", function() {
    var g = new Graph();
    g.setPath(["a", "b", "d"]);
    g.setPath(["a", "c", "d"]);

    var result = topsort(g);
    expect(result.indexOf("a")).to.equal(0);
    expect(result.indexOf("b")).to.be.lt(result.indexOf("d"));
    expect(result.indexOf("c")).to.be.lt(result.indexOf("d"));
    expect(result.indexOf("d")).to.equal(3);
  });

  it("throws CycleException if there is a cycle #1", function() {
    var g = new Graph();
    g.setPath(["b", "c", "a", "b"]);
    expect(function() { topsort(g); }).to.throw(CycleException);
  });

  it("throws CycleException if there is a cycle #2", function() {
    var g = new Graph();
    g.setPath(["b", "c", "a", "b"]);
    g.setEdge("b", "d");
    expect(function() { topsort(g); }).to.throw(CycleException);
  });

  it("throws CycleException if there is a cycle #3", function() {
    var g = new Graph();
    g.setPath(["b", "c", "a", "b"]);
    g.setNode("d");
    expect(function() { topsort(g); }).to.throw(CycleException);
  });
});
