var expect = require("./chai").expect,
    baseGraphTest = require("./base-graph-test");

var Graph = require("..").Graph;

describe("Graph", function() {
  var g;

  beforeEach(function() {
    g = new Graph();
  });

  baseGraphTest.tests(Graph);

  describe("graphSources", function() {
    it("is always empty", function() {
      g.setEdge("n1", "n2");
      g.setEdge("n2", "n3");
      g.setEdge("n4", "n3");
      g.set("n5");
      expect(g.graphSources()).to.be.empty;
    });
  });

  describe("graphSinks", function() {
    it("is always empty", function() {
      g.setEdge("n1", "n2");
      g.setEdge("n3", "n2");
      g.setEdge("n3", "n4");
      g.set("n5");
      expect(g.graphSinks()).to.be.empty;
    });
  });

  describe("successors", function() {
    it("returns all neighbors of a node", function() {
      g.setEdge("n1", "n1");
      g.setEdge("n1", "n2");
      g.setEdge("n2", "n3");
      g.setEdge("n3", "n1");
      g.set("n4");
      expect(g.successors("n1").sort()).to.eql(["n1", "n2", "n3"]);
    });
  });

  describe("predecessors", function() {
    it("returns all neighbors of a node", function() {
      g.setEdge("n1", "n1");
      g.setEdge("n1", "n2");
      g.setEdge("n2", "n3");
      g.setEdge("n3", "n1");
      g.set("n4");
      expect(g.predecessors("n1").sort()).to.eql(["n1", "n2", "n3"]);
    });
  });
});
