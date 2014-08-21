var _ = require("lodash"),
    BaseGraph = require("./base-graph");

module.exports = Digraph;

function Digraph() {
  this._init({}, {});

  // v -> true
  this._sources = {};

  // v -> true
  this._sinks = {};
}

Digraph.prototype = new BaseGraph();
Digraph.prototype.constructor = Digraph;


/* === Graph-level functions ========== */

Digraph.prototype.copy = function() {
  var copy = BaseGraph.prototype.copy.call(this);
  copy._sources = _.clone(this._sources);
  copy._sinks = _.clone(this._sinks);
  return copy;
};

Digraph.prototype.graphSources = function() {
  return _.keys(this._sources);
};

Digraph.prototype.graphSinks = function() {
  return _.keys(this._sinks);
};


/* === Node-level functions ========== */

Digraph.prototype._onAddNode = function(v) {
  this._sources[v] = this._sinks[v] = true;
};

Digraph.prototype._onRemoveNode = function(v) {
  _.forIn(this._inEdges[v], function(_, u) {
    --this.graphEdgeCount;
    delete this._outEdges[u][v];
  }, this);
  _.forIn(this._outEdges[v], function(_, w) {
    --this.graphEdgeCount;
    delete this._inEdges[w][v];
  }, this);
  delete this._sources[v];
  delete this._sinks[v];
};

BaseGraph.prototype.neighbors = function(v) {
  var adjs = this._inEdges[v];
  if (adjs) {
    _.assign(adjs, this._outEdges[v]);
    return _.keys(adjs);
  }
};


/* === Edge-level functions ========== */

Digraph.prototype._onSetEdge = function(v, w) {
  delete this._sources[w];
  delete this._sinks[v];
};

Digraph.prototype._onRemoveEdge = function(v, w) {
  if (_.isEmpty(this._outEdges[v])) {
    this._sinks[v] = true;
  }

  if (_.isEmpty(this._inEdges[w])) {
    this._sources[w] = true;
  }
};
