var expect = require("./chai").expect;

var util = require("../lib/util");

describe("util", function() {
  describe("copy", function() {
    it("creates a shallow copy of the input object", function() {
      var obj = { k1: "v1", k2: "v2" };
      var copy = util.copy(obj);
      expect(copy).to.eql(obj);

      copy.k1 = "v3";
      expect(obj.k1).to.equal("v1");

      obj.k2 = "v4";
      expect(copy.k2).to.equal("v2");
    });
  });

  describe("values", function() {
    it("returns the values in the given object", function() {
      var obj = { k1: "v1", k2: "v2" };
      var result = util.values(obj);
      expect(result.sort()).to.eql(["v1", "v2"]);
    });
  });
});
