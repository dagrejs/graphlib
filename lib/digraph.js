var _ = require("lodash"),
    BaseGraph = require("./base-graph");

module.exports = Digraph;

function Digraph() {
  BaseGraph.call(this, {}, {}, {}, {});
}

Digraph.prototype = new BaseGraph();
Digraph.prototype.constructor = Digraph;


/* === Graph-level functions ========== */

Digraph.prototype.isDirected = function() {
  return true;
};

Digraph.prototype.copy = function() {
  return BaseGraph.prototype.copy.call(this);
};


/* === Node-level functions ========== */

Digraph.prototype._onRemoveNode = function(v) {
  _.forIn(this._inEdges[v], function(_, u) {
    --this._edgeCount;
    delete this._outEdges[u][v];
  }, this);
  _.forIn(this._outEdges[v], function(_, w) {
    --this._edgeCount;
    delete this._inEdges[w][v];
  }, this);
};

BaseGraph.prototype.neighbors = function(v) {
  var adjs = this._inEdges[v];
  if (adjs) {
    _.assign(adjs, this._outEdges[v]);
    return _.keys(adjs);
  }
};


/* === Edge-level functions ========== */

Digraph.prototype.nodeEdges = function(v) {
  var inEdges = this.inEdges(v);
  if (inEdges) {
    return _.union(inEdges, this.outEdges(v));
  }
};
