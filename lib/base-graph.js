var _ = require("lodash");

module.exports = BaseGraph;

function BaseGraph() {}

/* Number of nodes in the graph. Should only be changed by the implementation. */
BaseGraph.prototype._nodeCount = 0;

/* Number of edges in the graph. Should only be changed by the implementation. */
BaseGraph.prototype._edgeCount = 0;

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
  if (this._graphLabel) {
    copy._graphLabel = this._graphLabel;
  }
  copy._nodeCount = this._nodeCount;
  copy._edgeCount = this._edgeCount;
  copy._nodes = _.clone(this._nodes);
  copy._inEdges = _.mapValues(this._inEdges, _.clone);
  copy._outEdges = _.mapValues(this._outEdges, _.clone);
  return copy;
};

BaseGraph.prototype.getGraph = function() {
  return this._graphLabel;
};

BaseGraph.prototype.setGraph = function(label) {
  if (arguments.length) {
    this._graphLabel = label;
  } else {
    delete this._graphLabel;
  }
};

BaseGraph.prototype.nodeCount = function() {
  return this._nodeCount;
};

BaseGraph.prototype.nodeIds = function() {
  return _.keys(this._nodes);
};

BaseGraph.prototype.sources = function() {
  return [];
};

BaseGraph.prototype.sinks = function() {
  return [];
};

BaseGraph.prototype.edgeCount = function() {
  return this._edgeCount;
};

BaseGraph.prototype.edges = function() {
  var i = 0;
  return _.transform(this._outEdges, function(acc, vOut) {
    return _.each(vOut, function(edge) {
      acc[i++] = edge;
    });
  }, new Array(this._edgeCount));
};


/* === Node-level functions ========== */

BaseGraph.prototype.setNode = function(v, label) {
  if (!_.has(this._nodes, v)) {
    this._inEdges[v] = {};
    this._outEdges[v] = {};
    ++this._nodeCount;
    this._onAddNode(v);
  }
  this._nodes[v] = label;
  return this;
};

BaseGraph.prototype.updateNode = function(v, updater) {
  return this.setNode(v, updater(this.getNode(v)));
};

BaseGraph.prototype.removeNode =  function(v) {
  if (_.has(this._nodes, v)) {
    --this._nodeCount;
    delete this._nodes[v];

    this._onRemoveNode(v);

    delete this._inEdges[v];
    delete this._outEdges[v];
  }
  return this;
};

BaseGraph.prototype.getNode = function(v) {
  return this._nodes[v];
};

BaseGraph.prototype.hasNode = function(v) {
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
    this.setNode(v);
    newNode = true;
  }

  if (!_.has(this._nodes, w)) {
    this.setNode(w);
    newNode = true;
  }

  if (newNode || !_.has(this._outEdges[v], w)) {
    ++this._edgeCount;
  }

  var edgeCtx = { v: String(v), w: String(w) };
  if (label !== undefined) {
    edgeCtx.label = label;
  }
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
      --this._edgeCount;
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

