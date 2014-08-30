var _ = require("lodash"),
    expect = require("../chai").expect,
    PriorityQueue = require("../../lib/data/priority-queue");

describe("data.PriorityQueue", function() {
  var pq;

  beforeEach(function() {
    pq = new PriorityQueue();
  });

  describe("size", function() {
    it("returns 0 for an empty queue", function() {
      expect(pq.size()).to.equal(0);
    });

    it("returns the number of elements in the queue", function() {
      pq.add("a", 1);
      expect(pq.size()).to.equal(1);
      pq.add("b", 2);
      expect(pq.size()).to.equal(2);
    });
  });

  describe("keys", function() {
    it("returns all of the keys in the queue", function() {
      pq.add("a", 1);
      pq.add(1, 2);
      pq.add(false, 3);
      pq.add(undefined, 4);
      pq.add(null, 5);
      expect(_.sortBy(pq.keys())).to.eql(
                _.sortBy(["a", "1", "false", "undefined", "null"]));
    });
  });

  describe("has", function() {
    it("returns true if the key is in the queue", function() {
      pq.add("a", 1);
      expect(pq.has("a")).to.be.true;
    });

    it("returns false if the key is not in the queue", function() {
      expect(pq.has("a")).to.be.false;
    });
  });

  describe("priority", function() {
    it("returns the current priority for the key", function() {
      pq.add("a", 1);
      pq.add("b", 2);
      expect(pq.priority("a")).to.equal(1);
      expect(pq.priority("b")).to.equal(2);
    });

    it("returns undefined if the key is not in the queue", function() {
      expect(pq.priority("foo")).to.be.undefined;
    });
  });

  describe("min", function() {
    it("throws an error if there is no element in the queue", function() {
      expect(function() { pq.min(); }).to.throw();
    });

    it("returns the smallest element", function() {
      pq.add("b", 2);
      pq.add("a", 1);
      expect(pq.min()).to.equal("a");
    });

    it("does not remove the minimum element from the queue", function() {
      pq.add("b", 2);
      pq.add("a", 1);
      pq.min();
      expect(pq.size()).to.equal(2);
    });
  });

  describe("add", function() {
    it("adds the key to the queue", function() {
      pq.add("a", 1);
      expect(pq.keys()).to.eql(["a"]);
    });

    it("returns true if the key was added", function() {
      expect(pq.add("a", 1)).to.be.true;
    });

    it("returns false if the key already exists in the queue", function() {
      pq.add("a", 1);
      expect(pq.add("a", 1)).to.be.false;
    });
  });

  describe("removeMin", function() {
    it("removes the minimum element from the queue", function() {
      pq.add("b", 2);
      pq.add("a", 1);
      pq.add("c", 3);
      pq.add("e", 5);
      pq.add("d", 4);
      expect(pq.removeMin()).to.equal("a");
      expect(pq.removeMin()).to.equal("b");
      expect(pq.removeMin()).to.equal("c");
      expect(pq.removeMin()).to.equal("d");
      expect(pq.removeMin()).to.equal("e");
    });

    it("throws an error if there is no element in the queue", function() {
      expect(function() { pq.removeMin(); }).to.throw();
    });
  });

  describe("decrease", function() {
    it("decreases the priority of a key", function() {
      pq.add("a", 1);
      pq.decrease("a", -1);
      expect(pq.priority("a")).to.equal(-1);
    });

    it("raises an error if the key is not in the queue", function() {
      expect(function() { pq.decrease("a", -1); }).to.throw();
    });

    it("raises an error if the new priority is greater than current", function() {
      pq.add("a", 1);
      expect(function() { pq.decrease("a", 2); }).to.throw();
    });
  });
});
