var _ = require("lodash");

module.exports = BaseGraph;

function BaseGraph() {}

/* Number of nodes in the graph. Should only be changed by the implementation. */
BaseGraph.prototype.graphNodeCount = 0;

/* Number of edges in the graph. Should only be changed by the implementation. */
BaseGraph.prototype.graphEdgeCount = 0;

/* Initializes properties for a new instance. */
BaseGraph.prototype._init = function(inEdges, outEdges) {
  // v -> label
  this._nodes = {};

  // v -> u -> label
  this._inEdges = inEdges;

  // v -> w -> label
  this._outEdges = outEdges;
};


/* === Graph-level functions ========== */

BaseGraph.prototype.copy = function() {
  var copy = new this.constructor();
  copy.graphNodeCount = this.graphNodeCount;
  copy.graphEdgeCount = this.graphEdgeCount;
  copy._nodes = _.clone(this._nodes);
  copy._inEdges = _.mapValues(this._inEdges, _.clone);
  copy._outEdges = _.mapValues(this._outEdges, _.clone);
  return copy;
};

BaseGraph.prototype.graphNodeIds = function() {
  return _.keys(this._nodes);
};

BaseGraph.prototype.graphSources = function() {
  return [];
};

BaseGraph.prototype.graphSinks = function() {
  return [];
};

BaseGraph.prototype.graphEdges = function() {
  var i = 0;
  return _.transform(this._outEdges, function(acc, vOut) {
    return _.each(vOut, function(edge) {
      acc[i++] = edge;
    });
  }, new Array(this.graphEdgeCount));
};


/* === Node-level functions ========== */

BaseGraph.prototype.set = function(v, label) {
  if (!_.has(this._nodes, v)) {
    this._inEdges[v] = {};
    this._outEdges[v] = {};
    ++this.graphNodeCount;
    this._onAddNode(v);
  }
  this._nodes[v] = label;
  return this;
};

BaseGraph.prototype.update = function(v, updater) {
  return this.set(v, updater(this.get(v)));
};

BaseGraph.prototype.remove =  function(v) {
  if (_.has(this._nodes, v)) {
    --this.graphNodeCount;
    delete this._nodes[v];

    this._onRemoveNode(v);

    delete this._inEdges[v];
    delete this._outEdges[v];
  }
  return this;
};

BaseGraph.prototype.get = function(v) {
  return this._nodes[v];
};

BaseGraph.prototype.has = function(v) {
  return _.has(this._nodes, v);
};

BaseGraph.prototype.successors = function(v) {
  var outEdges = this._outEdges[v];
  return outEdges && _.keys(outEdges);
};

BaseGraph.prototype.predecessors = function(v) {
  var inEdges = this._inEdges[v];
  return inEdges && _.keys(inEdges);
};

BaseGraph.prototype.inEdges = function(v) {
  var inEdges = this._inEdges[v];
  if (inEdges) {
    return _.values(inEdges);
  }
};

BaseGraph.prototype.outEdges = function(v) {
  var outEdges = this._outEdges[v];
  if (outEdges) {
    return _.values(outEdges);
  }
};

BaseGraph.prototype._onAddNode = _.noop;

BaseGraph.prototype._onRemoveNode = _.noop;


/* === Edge-level functions ========== */

BaseGraph.prototype.setEdge = function(v, w, label) {
  var newNode = false;

  if (!_.has(this._nodes, v)) {
    this.set(v);
    newNode = true;
  }

  if (!_.has(this._nodes, w)) {
    this.set(w);
    newNode = true;
  }

  if (newNode || !_.has(this._outEdges[v], w)) {
    ++this.graphEdgeCount;
  }

  var edgeCtx = { v: v, w: w, label: label };
  Object.freeze(edgeCtx);
  this._outEdges[v][w] = this._inEdges[w][v] = edgeCtx;

  this._onSetEdge(v, w, label);

  return this;
};

BaseGraph.prototype.updateEdge = function(v, w, updater) {
  return this.setEdge(v, w, updater(this.getEdge(v, w)));
};

BaseGraph.prototype.removeEdge = function(v, w) {
  var vOut = this._outEdges[v],
      wIn = this._inEdges[w];

  if (vOut && wIn) {
    if (_.has(vOut, w)) {
      --this.graphEdgeCount;
    }

    delete vOut[w];
    delete wIn[v];

    this._onRemoveEdge(v, w);
  }

  return this;
};

BaseGraph.prototype.getEdge = function(v, w) {
  var vOut = this._outEdges[v];
  if (vOut) {
    var edge = vOut[w];
    return edge && edge.label;
  }
};

BaseGraph.prototype.hasEdge = function(v, w) {
  return !!this.getEdge(v, w);
};

BaseGraph.prototype._onSetEdge = function() {};

BaseGraph.prototype._onRemoveEdge = function() {};

