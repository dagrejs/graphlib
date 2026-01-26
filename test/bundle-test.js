const graphlib = require("..");

// These are smoke tests to make sure the bundles look like they are working
// correctly.

describe("bundle", function() {
  it("exports graphlib", function() {
    expect(graphlib).toBeInstanceOf(Object);
    expect(graphlib.Graph).toBeInstanceOf(Function);
    expect(graphlib.json).toBeInstanceOf(Object);
    expect(graphlib.alg).toBeInstanceOf(Object);
    expect(typeof graphlib.version).toBe("string");
  });

  it("can do simple graph operations", function() {
    var g = new graphlib.Graph();
    g.setNode("a");
    g.setNode("b");
    g.setEdge("a", "b");
    expect(g.hasNode("a")).toBe(true);
    expect(g.hasNode("b")).toBe(true);
    expect(g.hasEdge("a", "b")).toBe(true);
  });

  it("can serialize to json and back", function() {
    var g = new graphlib.Graph();
    g.setNode("a");
    g.setNode("b");
    g.setEdge("a", "b");

    var json = graphlib.json.write(g);
    var g2 = graphlib.json.read(json);
    expect(g2.hasNode("a")).toBe(true);
    expect(g2.hasNode("b")).toBe(true);
    expect(g2.hasEdge("a", "b")).toBe(true);
  });
});
