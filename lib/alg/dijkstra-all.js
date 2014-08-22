var dijkstra = require("./dijkstra"),
    _ = require("lodash");

module.exports = dijkstraAll;

function dijkstraAll(g, weightFunc, edgeFunc) {
  return _.transform(g.nodeIds(), function(acc, v) {
    acc[v] = dijkstra(g, v, weightFunc, edgeFunc);
  }, {});
}
