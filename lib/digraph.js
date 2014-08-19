var _ = require("lodash");

module.exports = Digraph;

function Digraph() {
  this._numNodes = 0;
  this._numEdges = 0;

  // v -> { in, v, label, out }
  //   in:  u -> edge id
  //   out: w -> edge id
  this._nodes = {};

  // index -> { v, w, label }
  this._edges = [];

  // some book keeping to reduce memory consumption with high volume edits.
  this._edgeSlots = [];
}

Digraph.prototype.copy = function() {
  var copy = new Digraph();
  copy._numNodes = this._numNodes;
  copy._numEdges = this._numEdges;
  copy._nodes = _.mapValues(this._nodes, _.clone);
  copy._edges = _.map(this._edges, _.clone);
  return copy;
};

Digraph.prototype.numNodes = function() {
  return this._numNodes;
};

Digraph.prototype.nodeIds = function() {
  return Object.keys(this._nodes);
};

Digraph.prototype.sources = function() {
  var nodes = this._nodes;
  return Object.keys(nodes).filter(function(v) {
    return Object.keys(nodes[v].in).length === 0;
  });
};

Digraph.prototype.sinks = function() {
  var nodes = this._nodes;
  return Object.keys(nodes).filter(function(v) {
    return Object.keys(nodes[v].out).length === 0;
  });
};

Digraph.prototype.set = function(v, label) {
  this._updateNodeCtx(v, setLabel(label));
  return this;
};

Digraph.prototype.update = function(v, updater) {
  return this.set(v, updater(this.get(v)));
};

Digraph.prototype.delete = function(v) {
  var ctx = this._getNodeCtx(v);
  if (ctx) {
    --this._numNodes;
    Object.keys(ctx.in).forEach(function(u) {
      this.deleteEdge(u, v);
    }, this);
    Object.keys(ctx.out).forEach(function(w) {
      this.deleteEdge(v, w);
    }, this);
  }
  delete this._nodes[v];
  return this;
};

Digraph.prototype.get = function(v) {
  var ctx = this._getNodeCtx(v);
  if (ctx) {
    return ctx.label;
  }
};

Digraph.prototype.has = function(v) {
  return !!this._nodes[v];
};

Digraph.prototype.successors = function(v) {
  var ctx = this._getNodeCtx(v);
  if (ctx) {
    return Object.keys(ctx.out);
  }
};

Digraph.prototype.predecessors = function(v) {
  var ctx = this._getNodeCtx(v);
  if (ctx) {
    return Object.keys(ctx.in);
  }
};

Digraph.prototype.neighbors = function(v) {
  var ctx = this._getNodeCtx(v);
  if (ctx) {
    var result = {};
    Object.keys(ctx.in).forEach(function(u) { result[u] = true; });
    Object.keys(ctx.out).forEach(function(w) { result[w] = true; });
    return Object.keys(result);
  }
};

Digraph.prototype.numEdges = function() {
  return this._edges.length - this._edgeSlots.length;
};

Digraph.prototype.edges = function() {
  return _.map(_.values(this._edges), _.clone);
};

Digraph.prototype.inEdges = function(v) {
  var ctx = this._getNodeCtx(v);
  if (ctx) {
    return _.map(_.values(ctx.in), function(edgeId) {
      return _.clone(this._edges[edgeId]);
    }, this);
  }
};

Digraph.prototype.setEdge = function(v, w, label) {
  var edgeId = this._getEdgeId(v, w);
  if (edgeId === undefined) {
    edgeId = this._createEdge(v, w, label);
    this._updateNodeCtx(v, addAdj("out", w, edgeId));
    this._updateNodeCtx(w, addAdj("in", v, edgeId));
  } else {
    this._edges[edgeId].label = label;
  }
  return this;
};

Digraph.prototype.updateEdge = function(v, w, updater) {
  return this.setEdge(v, w, updater(this.getEdge(v, w)));
};

Digraph.prototype.deleteEdge = function(v, w) {
  var edgeId = this._getEdgeId(v, w);
  if (edgeId !== undefined) {
    this._freeEdge(edgeId);
    this._updateNodeCtx(v, delAdj("out", w));
    this._updateNodeCtx(w, delAdj("out", v));
  }
  return this;
};

Digraph.prototype.getEdge = function(v, w) {
  var ctx = this._getEdgeCtx(v, w);
  if (ctx) {
    return ctx.label;
  }
};

Digraph.prototype.hasEdge = function(v, w) {
  return !!this._getEdgeCtx(v, w);
};

Digraph.prototype._getNodeCtx = function(v) {
  return this._nodes[v];
};

Digraph.prototype._getEdgeId = function(v, w) {
  var ctx = this._getNodeCtx(v);
  if (ctx) {
    return ctx.out[w];
  }
};

Digraph.prototype._getEdgeCtx = function(v, w) {
  var edgeId = this._getEdgeId(v, w);
  if (edgeId !== undefined) {
    return this._edges[edgeId];
  }
};

Digraph.prototype._updateNodeCtx = function(v, updater) {
  var ctx = this._getNodeCtx(v);
  if (!ctx) {
    ++this._numNodes;
    ctx = this._nodes[v] = { in: {}, v: v, label: undefined, out: {} };
  }
  updater(ctx);
};

Digraph.prototype._createEdge = function(v, w, label) {
  var edge = { v: v, w: w, label: label };
  var edgeId = this._edgeSlots.pop();
  if (edgeId) {
    this._edges[edgeId] = edge;
  } else {
    edgeId = this._edges.length;
    this._edges.push(edge);
  }
  return edgeId;
};

Digraph.prototype._freeEdge = function(edgeId) {
  this._edgeSlots.push(edgeId);
  this._edges[edgeId] = undefined;
};

/** Helpers for use with updateNodeCtx */
function setLabel(label) {
  return function(ctx) {
    ctx.label = label;
  };
}

function addAdj(type, v, edgeId) {
  return function(ctx) {
    ctx[type][v] = edgeId;
  };
}

function delAdj(type, v) {
  return function(ctx) {
    delete ctx[type][v];
  };
}
