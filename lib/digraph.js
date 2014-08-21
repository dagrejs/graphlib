var _ = require("lodash"),
    nodeBehavior = require("./node-behavior");

module.exports = Digraph;

function Digraph() {
  this._graphEdgeCount = 0;

  // v -> label
  this._nodes = {};

  // v -> u -> label
  this._inEdges = {};

  // v -> w -> label
  this._outEdges = {};

  // v -> true
  this._sources = {};

  // v -> true
  this._sinks = {};
}

_.extend(Digraph.prototype, nodeBehavior);


/* === Graph-level functions ========== */

Digraph.prototype.copy = function() {
  var dest = new Digraph();
  this._copyTo(dest);
  dest._graphEdgeCount = this._graphEdgeCount;
  dest._inEdges = _.mapValues(this._inEdges, _.clone);
  dest._outEdges = _.mapValues(this._outEdges, _.clone);
  dest._sources = _.clone(this._sources);
  dest._sinks = _.clone(this._sinks);
  return dest;
};

Digraph.prototype.graphSources = function() {
  return _.keys(this._sources);
};

Digraph.prototype.graphSinks = function() {
  return _.keys(this._sinks);
};

Digraph.prototype.graphEdgeCount = function() {
  return this._graphEdgeCount;
};

Digraph.prototype.graphEdges = function() {
  var i = 0;
  return _.transform(this._outEdges, function(acc, vOut) {
    return _.each(vOut, function(edge) {
      acc[i++] = edge;
    });
  }, new Array(this._graphEdgeCount));
};


/* === Node-level functions ========== */

Digraph.prototype._onAddNode = function(v) {
  this._inEdges[v] = {};
  this._outEdges[v] = {};
  this._sources[v] = this._sinks[v] = true;
};

Digraph.prototype._onRemoveNode = function(v) {
  delete this._sources[v];
  delete this._sinks[v];
  _.forIn(this._inEdges[v], function(_, u) {
    --this._graphEdgeCount;
    delete this._outEdges[u][v];
  }, this);
  _.forIn(this._outEdges[v], function(_, w) {
    --this._graphEdgeCount;
    delete this._inEdges[w][v];
  }, this);
  delete this._inEdges[v];
  delete this._outEdges[v];
};

Digraph.prototype.successors = function(v) {
  var outEdges = this._outEdges[v];
  return outEdges && _.keys(outEdges);
};

Digraph.prototype.predecessors = function(v) {
  var inEdges = this._inEdges[v];
  return inEdges && _.keys(inEdges);
};

Digraph.prototype.neighbors = function(v) {
  var adjs = this._inEdges[v];
  if (adjs) {
    _.assign(adjs, this._outEdges[v]);
    return _.keys(adjs);
  }
};

Digraph.prototype.inEdges = function(v) {
  var inEdges = this._inEdges[v];
  if (inEdges) {
    return _.values(inEdges);
  }
};

Digraph.prototype.outEdges = function(v) {
  var outEdges = this._outEdges[v];
  if (outEdges) {
    return _.values(outEdges);
  }
};


/* === Edge-level functions ========== */

Digraph.prototype.setEdge = function(v, w, label) {
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
    ++this._graphEdgeCount;
  }

  delete this._sources[w];
  delete this._sinks[v];
  var edgeCtx = { v: v, w: w, label: label };
  Object.freeze(edgeCtx);
  this._outEdges[v][w] = this._inEdges[w][v] = edgeCtx;

  return this;
};

Digraph.prototype.updateEdge = function(v, w, updater) {
  return this.setEdge(v, w, updater(this.getEdge(v, w)));
};

Digraph.prototype.removeEdge = function(v, w) {
  var vOut = this._outEdges[v],
      wIn = this._inEdges[w];

  if (vOut && wIn) {
    if (_.has(vOut, w)) {
      --this._graphEdgeCount;
    }

    delete vOut[w];
    if (_.isEmpty(vOut)) {
      this._sinks[v] = true;
    }

    delete wIn[v];
    if (_.isEmpty(wIn)) {
      this._sources[w] = true;
    }
  }

  return this;
};

Digraph.prototype.getEdge = function(v, w) {
  var vOut = this._outEdges[v];
  if (vOut) {
    var edge = vOut[w];
    return edge && edge.label;
  }
};

Digraph.prototype.hasEdge = function(v, w) {
  return !!this.getEdge(v, w);
};
