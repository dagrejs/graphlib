// Returns `true` only if `f(x)` is `true` for all `x` in **xs**. Otherwise
// returns `false`. This function will return immediately if it finds a
// case where `f(x)` does not hold.
exports.all = function(xs, f) {
  for (var i = 0; i < xs.length; ++i) {
    if (!f(xs[i])) return false;
  }
  return true;
};

// Returns an array of all values for properties of **o**.
exports.values = function(o) {
  return Object.keys(o).map(function(k) { return o[k]; });
};
