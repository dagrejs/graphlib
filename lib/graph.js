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

Graph.prototype.degree = function(v) {
  var outV = this._outEdges[v];
  if (outV) {
    return _.reduce(outV, function(acc, edge) {
      return acc + (edge.v === edge.w ? 2 : 1);
    }, 0);
  }
};
Graph.prototype.inDegree = Graph.prototype.degree;
Graph.prototype.outDegree = Graph.prototype.degree;

Graph.prototype._onRemoveNode = function(v) {
  _.forIn(this._inEdges[v], function(_value, u) {
    var outU = this._outEdges[u];
    --this._edgeCount;
    delete outU[v];
    if (_.isEmpty(outU)) {
      this._sinks[u] = true;
    }
  }, this);

  // On the second pass we do not decrement the graph count. These are the
  // inverse elements of the edges already deleted.
  _.forIn(this._outEdges[v], function(_value, w) {
    var inW = this._inEdges[w];
    delete inW[v];
    if (_.isEmpty(inW)) {
      this._sources[w] = true;
    }
  }, this);
};
