var util = require("../util");

module.exports = Set;

/**
 * Constructs a new Set with an optional set of `initialKeys`.
 *
 * It is important to note that keys are coerced to String for most purposes
 * with this object, similar to the behavior of JavaScript's Object. For
 * example, the following will add only one key:
 *
 *     var s = new Set();
 *     s.add(1);
 *     s.add("1");
 *
 * However, the type of the key is preserved internally so that `keys` returns
 * the original key set uncoerced. For the above example, `keys` would return
 * `[1]`.
 */
function Set(initialKeys) {
  this._size = 0;
  this._keys = {};

  if (initialKeys) {
    for (var i = 0, il = initialKeys.length; i < il; ++i) {
      this.add(initialKeys[i]);
    }
  }
}

/**
 * Applies the [intersect](#intersect) function to all sets in the given array
 * and returns the result as a new Set.
 *
 * @param {Set[]} sets the sets to intersect
 */
Set.intersectAll = function(sets) {
  if (sets.length === 0) {
    return new Set();
  }

  var result = new Set(sets[0].keys());
  sets.forEach(function(set) {
    result = result.intersect(set);
  });
  return result;
};

/**
 * Applies the [union](#union) function to all sets in the given array and
 * returns the result as a new Set.
 *
 * @param {Set[]} sets the sets to union
 */
Set.unionAll = function(sets) {
  var result = new Set();
  sets.forEach(function(set) {
    result = result.union(set);
  });
  return result;
};

/**
 * Returns the size of this set in `O(1)` time.
 */
Set.prototype.size = function() {
  return this._size;
};

/**
 * Returns the keys in this set. Takes `O(n)` time.
 */
Set.prototype.keys = function() {
  return util.values(this._keys);
};

/**
 * Tests if a key is present in this Set. Returns `true` if it is and `false`
 * if not. Takes `O(1)` time.
 */
Set.prototype.has = function(key) {
  return key in this._keys;
};

/**
 * Adds a new key to this Set if it is not already present. Returns `true` if
 * the key was added and `false` if it was already present. Takes `O(1)` time.
 */
Set.prototype.add = function(key) {
  if (!(key in this._keys)) {
    this._keys[key] = key;
    ++this._size;
    return true;
  }
  return false;
};

/**
 * Removes a key from this Set. If the key was removed this function returns
 * `true`. If not, it returns `false`. Takes `O(1)` time.
 */
Set.prototype.remove = function(key) {
  if (key in this._keys) {
    delete this._keys[key];
    --this._size;
    return true;
  }
  return false;
};

/**
 * Returns a new Set that only contains elements in both this set and the
 * `other` set. They keys come from this set.
 *
 * If `other` is not a Set it is treated as an Array.
 *
 * @param {Set} other the other set with which to perform an intersection
 */
Set.prototype.intersect = function(other) {
  // If the other Set does not look like a Set...
  if (!other.keys) {
    other = new Set(other);
  }
  var result = new Set();
  this.keys().forEach(function(k) {
    if (other.has(k)) {
      result.add(k);
    }
  });
  return result;
};

/**
 * Returns a new Set that contains all of the keys in `this` set and `other`
 * set. If a key is in `this` set, it is used in preference to the `other` set.
 *
 * If `other` is not a Set it is treated as an Array.
 *
 * @param {Set} other the other set with which to perform a union
 */
Set.prototype.union = function(other) {
  var otherKeys = other.keys ? other.keys() : other;
  return new Set(this.keys().concat(otherKeys));
};
