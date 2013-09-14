// Returns an array of all values for properties of **o**.
exports.values = function(o) {
  return Object.keys(o).map(function(k) { return o[k]; });
};
