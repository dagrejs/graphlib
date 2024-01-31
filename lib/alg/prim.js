"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = prim;
var _graph = _interopRequireDefault(require("../graph.js"));
var _priorityQueue = _interopRequireDefault(require("../data/priority-queue.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function prim(g, weightFunc) {
  var result = new _graph.default();
  var parents = {};
  var pq = new _priorityQueue.default();
  var v;
  function updateNeighbors(edge) {
    var w = edge.v === v ? edge.w : edge.v;
    var pri = pq.priority(w);
    if (pri !== undefined) {
      var edgeWeight = weightFunc(edge);
      if (edgeWeight < pri) {
        parents[w] = v;
        pq.decrease(w, edgeWeight);
      }
    }
  }
  if (g.nodeCount() === 0) {
    return result;
  }
  g.nodes().forEach(function (v) {
    pq.add(v, Number.POSITIVE_INFINITY);
    result.setNode(v);
  });

  // Start from an arbitrary node
  pq.decrease(g.nodes()[0], 0);
  var init = false;
  while (pq.size() > 0) {
    v = pq.removeMin();
    if (parents.hasOwnProperty(v)) {
      result.setEdge(v, parents[v]);
    } else if (init) {
      throw new Error("Input graph is not connected: " + g);
    } else {
      init = true;
    }
    g.nodeEdges(v).forEach(updateNeighbors);
  }
  return result;
}
module.exports = exports.default;
