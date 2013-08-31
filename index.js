exports.Digraph = require("./lib/Digraph");
exports.alg = require("./lib/alg");
exports.data = {
  PriorityQueue: require("./lib/data/PriorityQueue")
};
exports.version = require("./lib/version");

// Backwards compatibility - to remove at next minor version bump
exports.Graph = exports.Digraph;
