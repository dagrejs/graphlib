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

Digraph.prototype.inDegree = function(v) {
  var inV = this._inEdges[v];
  if (inV) {
    return _.size(inV);
  }
};

Digraph.prototype.outDegree = function(v) {
  var outV = this._outEdges[v];
  if (outV) {
    return _.size(outV);
  }
};

Digraph.prototype.degree = function(v) {
  var inDegree = this.inDegree(v);
  if (inDegree !== undefined) {
    return inDegree + this.outDegree(v);
  }
};

Digraph.prototype._onRemoveNode = function(v) {
  _.forIn(this._inEdges[v], function(_value, u) {
    var outU = this._outEdges[u];
    --this._edgeCount;
    delete outU[v];
    if (_.isEmpty(outU)) {
      this._sinks[u] = true;
    }
  }, this);
  _.forIn(this._outEdges[v], function(_value, w) {
    var inW = this._inEdges[w];
    --this._edgeCount;
    delete inW[v];
    if (_.isEmpty(inW)) {
      this._sources[w] = true;
    }
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
