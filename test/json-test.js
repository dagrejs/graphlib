var expect = require("./chai").expect,
    Graph = require("..").Graph,
    read = require("..").json.read,
    write = require("..").json.write;

describe("json", function() {
  it("preserves the graph options", function() {
    expect(rw(new Graph({ directed: true })).isDirected()).to.be.true;
    expect(rw(new Graph({ directed: false })).isDirected()).to.be.false;
    expect(rw(new Graph({ multigraph: true })).isMultigraph()).to.be.true;
    expect(rw(new Graph({ multigraph: false })).isMultigraph()).to.be.false;
    expect(rw(new Graph({ compound: true })).isCompound()).to.be.true;
    expect(rw(new Graph({ compound: false })).isCompound()).to.be.false;
  });

  it("preserves the graph value, if any", function() {
    expect(rw(new Graph().setGraph(1)).getGraph()).equals(1);
    expect(rw(new Graph().setGraph({ foo: "bar" })).getGraph()).eqls({ foo: "bar" });
    expect(rw(new Graph()).getGraph()).to.be.undefined;
  });

  it("preserves nodes", function() {
    expect(rw(new Graph().setNode("a")).hasNode("a")).to.be.true;
    expect(rw(new Graph().setNode("a")).getNode("a")).to.be.undefined;
    expect(rw(new Graph().setNode("a", 1)).getNode("a")).equals(1);
    expect(rw(new Graph().setNode("a", { foo: "bar" })).getNode("a"))
      .eqls({ foo: "bar" });
  });

  it("preserves simple edges", function() {
    expect(rw(new Graph().setEdge("a", "b")).hasEdge("a", "b")).to.be.true;
    expect(rw(new Graph().setEdge("a", "b")).getEdge("a", "b")).to.be.undefined;
    expect(rw(new Graph().setEdge("a", "b", 1)).getEdge("a", "b")).equals(1);
    expect(rw(new Graph().setEdge("a", "b", { foo: "bar" })).getEdge("a", "b"))
      .eqls({ foo: "bar" });
  });

  it("preserves multi-edges", function() {
    var g = new Graph({ multigraph: true });

    g.setEdge({ v: "a", w: "b", name: "foo" });
    expect(rw(g).hasEdge("a", "b", "foo")).to.be.true;

    g.setEdge({ v: "a", w: "b", name: "foo" });
    expect(rw(g).getEdge("a", "b", "foo")).to.be.undefined;

    g.setEdge({ v: "a", w: "b", name: "foo" }, 1);
    expect(rw(g).getEdge("a", "b", "foo")).equals(1);

    g.setEdge({ v: "a", w: "b", name: "foo" }, { foo: "bar" });
    expect(rw(g).getEdge("a", "b", "foo")).eqls({ foo: "bar" });
  });

  it("preserves parent / child relationships", function() {
    expect(rw(new Graph({ compound: true }).setNode("a")).getParent("a"))
      .to.be.undefined;
    expect(rw(new Graph({ compound: true }).setParent("a", "parent")).getParent("a"))
      .to.equal("parent");
  });
});

function rw(g) {
  return read(write(g));
}
