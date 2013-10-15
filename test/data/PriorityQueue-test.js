var assert = require('chai').assert,
    PriorityQueue = require('../..').data.PriorityQueue;

describe('data.PriorityQueue', function() {
  var pq;

  beforeEach(function() {
    pq = new PriorityQueue();
  });

  describe('size', function() {
    it('returns 0 for an empty queue', function() {
      assert.equal(pq.size(), 0);
    });

    it('returns the number of elements in the queue', function() {
      pq.add('a', 1);
      assert.equal(pq.size(), 1);
      pq.add('b', 2);
      assert.equal(pq.size(), 2);
    });
  });

  describe('keys', function() {
    it('returns all of the keys in the queue', function() {
      pq.add('a', 1);
      pq.add(1, 2);
      pq.add(false, 3);
      pq.add(undefined, 4);
      pq.add(null, 5);
      assert.deepEqual(pq.keys().sort(), ['a', 1, false, undefined, null].sort());
    });
  });

  describe('has', function() {
    it('returns true if the key is in the queue', function() {
      pq.add('a', 1);
      assert.isTrue(pq.has('a'));
    });

    it('returns false if the key is not in the queue', function() {
      assert.isFalse(pq.has('a'));
    });
  });

  describe('priority', function() {
    it('returns the current priority for the key', function() {
      pq.add('a', 1);
      pq.add('b', 2);
      assert.equal(pq.priority('a'), 1);
      assert.equal(pq.priority('b'), 2);
    });

    it('returns undefined if the key is not in the queue', function() {
      assert.isUndefined(pq.priority('foo'));
    });
  });

  describe('min', function() {
    it('throws an error if there is no element in the queue', function() {
      assert.throws(function() { pq.min(); });
    });

    it('returns the smallest element', function() {
      pq.add('b', 2);
      pq.add('a', 1);
      assert.equal(pq.min(), 'a');
    });

    it('does not remove the minimum element from the queue', function() {
      pq.add('b', 2);
      pq.add('a', 1);
      pq.min();
      assert.equal(pq.size(), 2);
    });
  });

  describe('add', function() {
    it('adds the key to the queue', function() {
      pq.add('a', 1);
      assert.deepEqual(pq.keys(), ['a']);
    });

    it('returns true if the key was added', function() {
      assert.isTrue(pq.add('a', 1));
    });

    it('returns false if the key already exists in the queue', function() {
      pq.add('a', 1);
      assert.isFalse(pq.add('a', 1));
    });
  });

  describe('removeMin', function() {
    it('removes the minimum element from the queue', function() {
      pq.add('b', 2);
      pq.add('a', 1);
      pq.add('c', 3);
      pq.add('e', 5);
      pq.add('d', 4);
      assert.equal(pq.removeMin(), 'a');
      assert.equal(pq.removeMin(), 'b');
      assert.equal(pq.removeMin(), 'c');
      assert.equal(pq.removeMin(), 'd');
      assert.equal(pq.removeMin(), 'e');
    });

    it('throws an error if there is no element in the queue', function() {
      assert.throws(function() { pq.removeMin(); });
    });
  });

  describe('decrease', function() {
    it('decreases the priority of a key', function() {
      pq.add('a', 1);
      pq.decrease('a', -1);
      assert.equal(pq.priority('a'), -1);
    });

    it('raises an error if the key is not in the queue', function() {
      assert.throws(function() { pq.decrease('a', -1); });
    });

    it('raises an error if the new priority is greater than current', function() {
      pq.add('a', 1);
      assert.throws(function() { pq.decrease('a', 2); });
    });
  });
});
