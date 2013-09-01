exports.Digraph = require("./lib/Digraph");
exports.alg = {
  isAcyclic: require("./lib/alg/isAcyclic"),
  dijkstra: require("./lib/alg/dijkstra"),
  dijkstraAll: require("./lib/alg/dijkstraAll"),
  findCycles: require("./lib/alg/findCycles"),
  tarjan: require("./lib/alg/tarjan"),
  topsort: require("./lib/alg/topsort")
};
exports.data = {
  PriorityQueue: require("./lib/data/PriorityQueue"),
  Set: require("./lib/data/Set")
};
exports.version = require("./lib/version");
