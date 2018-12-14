var expect = require("../chai").expect,
    Graph = require("../..").Graph,
    reduce = require("../..").alg.reduce;

describe("alg.reduce", function() {
  it("returns the initial accumulator value when the graph is empty",
    function() {
      var g = new Graph();

      expect(reduce(g, [], "pre", function(a, b) {
        return a + "wrong" + b;
      }, 0)).to.eql(0);
    }
  );

  it("applies the accumulator function to all nodes in the graph", function() {
    var g = new Graph({ directed: false });
    g.setPath(["1", "2", "3", "5", "7"]);
    g.setPath(["2", "5", "11", "13"]);

    expect(reduce(g, "2", "pre", function(a, b) {
      return Number(a) + Number(b);
    }, 0)).to.eql(42);
  });

  it("traverses the graph in pre order", function() {
    var g = new Graph({ directed: false });
    g.setPath(["1", "2", "3", "5", "7"]);
    g.setPath(["2", "5", "11", "13"]);

    expect(reduce(g, "2", "pre", function(a, b) {
      return a + b + "-";
    }, "")).to.eql("2-1-3-5-11-13-7-");
  });

  it("traverses the graph in post order", function() {
    var g = new Graph({ directed: false });
    g.setPath(["1", "2", "3", "5", "7"]);
    g.setPath(["2", "5", "11", "13"]);

    expect(reduce(g, "2", "post", function(a, b) {
      return a + b + "-";
    }, "")).to.eql("1-13-11-7-5-3-2-");
  });
});
