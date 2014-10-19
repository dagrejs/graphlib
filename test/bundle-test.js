/* global chai, graphlib */

// These are smoke tests to make sure the bundles look like they are working
// correctly.

var expect = chai.expect;

describe("bundle", function() {
  it("exports graphlib", function() {
    expect(graphlib).to.be.an("object");
    expect(graphlib.Graph).to.be.a("function");
    expect(graphlib.json).to.be.a("object");
    expect(graphlib.alg).to.be.a("object");
    expect(graphlib.version).to.be.a("string");
  });

  it("can do simple graph operations", function() {
    var g = new graphlib.Graph();
    g.setNode("a");
    g.setNode("b");
    g.setEdge("a", "b");
    expect(g.hasNode("a")).to.be.true;
    expect(g.hasNode("b")).to.be.true;
    expect(g.hasEdge("a", "b")).to.be.true;
  });

  it("can serialize to json and back", function() {
    var g = new graphlib.Graph();
    g.setNode("a");
    g.setNode("b");
    g.setEdge("a", "b");

    var json = graphlib.json.write(g);
    var g2 = graphlib.json.read(json);
    expect(g2.hasNode("a")).to.be.true;
    expect(g2.hasNode("b")).to.be.true;
    expect(g2.hasEdge("a", "b")).to.be.true;
  });
});
