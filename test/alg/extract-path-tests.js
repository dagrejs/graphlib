var expect = require("../chai").expect,
    extractPath = require("../..").alg.extractPath;

describe("alg.extractPath", function() {
  it("returns weight: 0 and path: [source], from source to source", function() {
    var shortestPaths = {
      "a": { distance: 0 },
      "b": { distance: 73, predecessor: "a" }
    };
    expect(extractPath(shortestPaths, "a", "a")).to.eql(
      { weight: 0,
        path: ["a"]
      });
  });

  it("returns weight and path from source to destination", function() {
    var shortestPaths = {
      "a": { distance: 0 },
      "b": { distance: 25, predecessor: "a" },
      "c": { distance: 55, predecessor: "b" },
      "d": { distance: 44, predecessor: "b" },
      "e": { distance: 73, predecessor: "c" },
      "f": { distance: 65, predecessor: "d" },
      "g": { distance: 67, predecessor: "b" },
    };
    expect(extractPath(shortestPaths, "a", "e")).to.eql(
      { weight: 73,
        path: ["a", "b", "c", "e"]
      });
  });

  it("throws an error when provided with an invalid source vertex", function() {
    var shortestPaths = {
      "a": { distance: 0 },
      "b": { distance: 17, predecessor: "c" },
      "c": { distance: 42, predecessor: "a" }
    };
    expect(function() { extractPath(shortestPaths, "b", "c"); }).to.throw();
  });

  it("throws an error when given an invalid destination vertex", function() {
    var shortestPaths = {
      "a": { distance: 0 },
      "b": { distance: 99, predecessor: "a" },
      "c": { distance: 100 }
    };
    expect(function() { extractPath(shortestPaths, "a", "c"); }).to.throw();
  });
});
