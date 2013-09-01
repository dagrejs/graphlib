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
    initialKeys.forEach(function(key) { this.add(key); }, this);
  }
}

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
 * Returns a new `Set` that contains the intersection of keys from this set and
 * `other`. The keys themselves come from this set.
 *
 * @param {Set} other the other set with which to perform an intersection
 */
Set.prototype.intersect = function(other) {
  var s = new Set();
  this.keys().forEach(function(k) {
    if (other.has(k)) {
      s.add(k);
    }
  });
  return s;
};

/**
 * Returns a new `Set` that contains the union of the keys from this set and
 * `other`. The keys from this set take precedence over those from `other` when
 * there is overlap.
 *
 * @param {Set} other the other set with which to perform a union
 */
Set.prototype.union = function(other) {
  var s = new Set(this.keys());
  other.keys().forEach(function(k) {
    s.add(k);
  });
  return s;
};
