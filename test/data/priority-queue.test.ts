import _ from 'lodash';
import PriorityQueue from '../../lib/data/priority-queue';

describe('data.PriorityQueue', function () {
  let pq;

  beforeEach(function () {
    pq = new PriorityQueue();
  });

  describe('size', function () {
    it('returns 0 for an empty queue', function () {
      expect(pq.size()).toEqual(0);
    });

    it('returns the number of elements in the queue', function () {
      pq.add('a', 1);
      expect(pq.size()).toEqual(1);
      pq.add('b', 2);
      expect(pq.size()).toEqual(2);
    });
  });

  describe('keys', function () {
    it('returns all of the keys in the queue', function () {
      pq.add('a', 1);
      pq.add(1, 2);
      pq.add(false, 3);
      pq.add(undefined, 4);
      pq.add(null, 5);
      expect(_.sortBy(pq.keys())).toEqual(
        _.sortBy(['a', '1', 'false', 'undefined', 'null']),
      );
    });
  });

  describe('has', function () {
    it('returns true if the key is in the queue', function () {
      pq.add('a', 1);
      expect(pq.has('a')).toBe(true);
    });

    it('returns false if the key is not in the queue', function () {
      expect(pq.has('a')).toBe(false);
    });
  });

  describe('priority', function () {
    it('returns the current priority for the key', function () {
      pq.add('a', 1);
      pq.add('b', 2);
      expect(pq.priority('a')).toEqual(1);
      expect(pq.priority('b')).toEqual(2);
    });

    it('returns undefined if the key is not in the queue', function () {
      expect(pq.priority('foo')).toBe(undefined);
    });
  });

  describe('min', function () {
    it('throws an error if there is no element in the queue', function () {
      expect(function () {
        pq.min();
      }).toThrow();
    });

    it('returns the smallest element', function () {
      pq.add('b', 2);
      pq.add('a', 1);
      expect(pq.min()).toEqual('a');
    });

    it('does not remove the minimum element from the queue', function () {
      pq.add('b', 2);
      pq.add('a', 1);
      pq.min();
      expect(pq.size()).toEqual(2);
    });
  });

  describe('add', function () {
    it('adds the key to the queue', function () {
      pq.add('a', 1);
      expect(pq.keys()).toEqual(['a']);
    });

    it('returns true if the key was added', function () {
      expect(pq.add('a', 1)).toBe(true);
    });

    it('returns false if the key already exists in the queue', function () {
      pq.add('a', 1);
      expect(pq.add('a', 1)).toBe(false);
    });
  });

  describe('removeMin', function () {
    it('removes the minimum element from the queue', function () {
      pq.add('b', 2);
      pq.add('a', 1);
      pq.add('c', 3);
      pq.add('e', 5);
      pq.add('d', 4);
      expect(pq.removeMin()).toEqual('a');
      expect(pq.removeMin()).toEqual('b');
      expect(pq.removeMin()).toEqual('c');
      expect(pq.removeMin()).toEqual('d');
      expect(pq.removeMin()).toEqual('e');
    });

    it('throws an error if there is no element in the queue', function () {
      expect(function () {
        pq.removeMin();
      }).toThrow();
    });
  });

  describe('decrease', function () {
    it('decreases the priority of a key', function () {
      pq.add('a', 1);
      pq.decrease('a', -1);
      expect(pq.priority('a')).toEqual(-1);
    });

    it('raises an error if the key is not in the queue', function () {
      expect(function () {
        pq.decrease('a', -1);
      }).toThrow();
    });

    it('raises an error if the new priority is greater than current', function () {
      pq.add('a', 1);
      expect(function () {
        pq.decrease('a', 2);
      }).toThrow();
    });
  });
});
