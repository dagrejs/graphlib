var _ = require("lodash"),
    BaseGraph = require("./base-graph");

module.exports = Graph;

function Graph() {
  var edges = {},
      sourceSinks = {};
  BaseGraph.call(this, edges, edges, sourceSinks, sourceSinks);
}

Graph.prototype = new BaseGraph();
Graph.prototype.constructor = Graph;

/* === Graph-level functions ========== */

Graph.prototype.isDirected = function() {
  return false;
};

Graph.prototype.edges = function() {
  // Our edges are undirected, which is represented by two edges point in
  // opposite directions. Here we need to filer one of those edges out.
  var i = 0;
  return _.transform(this._outEdges, function(acc, vOut, v) {
    return _.each(vOut, function(edge) {
      if (v === edge.v) {
        acc[i++] = edge;
      }
    });
  }, new Array(this._edgeCount));
};

/* === Node-level functions ========== */

Graph.prototype.neighbors = BaseGraph.prototype.successors;

Graph.prototype.nodeEdges = BaseGraph.prototype.outEdges;

Graph.prototype._onRemoveNode = function(v) {
  _.forIn(this._inEdges[v], function(_, u) {
    --this._edgeCount;
    delete this._outEdges[u][v];
  }, this);

  // On the second pass we do not decrement the graph count. These are the
  // inverse elements of the edges already deleted.
  _.forIn(this._outEdges[v], function(_, w) {
    delete this._inEdges[w][v];
  }, this);
};
