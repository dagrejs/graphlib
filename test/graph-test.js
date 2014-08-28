var _ = require("lodash"),
    expect = require("./chai").expect,
    baseGraphTest = require("./base-graph-test");

var Graph = require("..").Graph;

exports.tests = tests;

tests(Graph);

function tests(GraphConstructor) {
  describe("Graph", function() {
    var g;

    beforeEach(function() {
      g = new GraphConstructor();
    });

    baseGraphTest.tests(GraphConstructor);

    describe("isDirected", function() {
      it("always returns false", function() {
        expect(g.isDirected()).to.be.false;
      });
    });

    describe("sources", function() {
      it("returns nodes with no edges", function() {
        g.setEdge("n1", "n2");
        g.setEdge("n2", "n3");
        g.setEdge("n4", "n3");
        g.setNode("n5");
        expect(g.sources()).to.eql(["n5"]);
      });
    });

    describe("sinks", function() {
      it("returns nodes with no edges", function() {
        g.setEdge("n1", "n2");
        g.setEdge("n3", "n2");
        g.setEdge("n3", "n4");
        g.setNode("n5");
        expect(g.sinks()).to.eql(["n5"]);
      });
    });

    describe("successors", function() {
      it("returns all neighbors of a node", function() {
        g.setEdge("n1", "n1");
        g.setEdge("n1", "n2");
        g.setEdge("n2", "n3");
        g.setEdge("n3", "n1");
        g.setNode("n4");
        expect(_.sortBy(g.successors("n1"))).to.eql(["n1", "n2", "n3"]);
      });
    });

    describe("predecessors", function() {
      it("returns all neighbors of a node", function() {
        g.setEdge("n1", "n1");
        g.setEdge("n1", "n2");
        g.setEdge("n2", "n3");
        g.setEdge("n3", "n1");
        g.setNode("n4");
        expect(_.sortBy(g.predecessors("n1"))).to.eql(["n1", "n2", "n3"]);
      });
    });

    describe("inDegree", function() {
      it("is an alias for degree", function() {
        expect(g.inDegree).to.equal(g.degree);
      });
    });

    describe("outDegree", function() {
      it("is an alias for degree", function() {
        expect(g.outDegree).to.equal(g.degree);
      });
    });

    describe("degree", function() {
      it("returns the number of edges incident on a node", function() {
        g.setEdge("a", "c");
        g.setEdge("b", "c");
        g.setEdge("c", "d");
        g.setEdge("c", "e");
        g.setEdge("c", "f");
        g.setEdge("g", "g");

        expect(g.degree("a")).to.equal(1);
        expect(g.degree("b")).to.equal(1);
        expect(g.degree("c")).to.equal(5);
        expect(g.degree("d")).to.equal(1);
        expect(g.degree("e")).to.equal(1);
        expect(g.degree("f")).to.equal(1);
        expect(g.degree("g")).to.equal(2);
      });
    });
  });
}
