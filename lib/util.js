// Returns `true` only if `f(x)` is `true` for all `x` in **xs**. Otherwise
// returns `false`. This function will return immediately if it finds a
// case where `f(x)` does not hold.
exports.all = function(xs, f) {
  for (var i = 0; i < xs.length; ++i) {
    if (!f(xs[i])) return false;
  }
  return true;
}

// Returns an array of all values for properties of **o**.
exports.values = function(o) {
  return Object.keys(o).map(function(k) { return o[k]; });
}

// Joins all of the arrays **xs** into a single array.
exports.concat = function(xs) {
  return Array.prototype.concat.apply([], xs);
}

// Similar to **concat**, but all duplicates are removed
exports.mergeKeys = function(xs) {
  var obj = {};
  xs.forEach(function(x) {
    x.forEach(function(o) {
      obj[o] = o;
    });
  });
  return exports.values(obj);
}
