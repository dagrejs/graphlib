var util = require("./util");

module.exports = Digraph;

function Digraph() {
  this._numNodes = 0;
  this._numEdges = 0;
  this._nodes = {};
}

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
      --this._numEdges;
      this._updateNodeCtx(u, delAdj("out", v));
    }, this);
    Object.keys(ctx.out).forEach(function(w) {
      --this._numEdges;
      this._updateNodeCtx(w, delAdj("in", v));
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
  return this._numEdges;
};

Digraph.prototype.edges = function() {
  var nodes = this._nodes;
  return Object.keys(nodes).reduce(function(acc, v) {
    var ctx = nodes[v],
        out = ctx.out,
        ws = Object.keys(out);
    return acc.concat(ws.map(function(w) {
      return util.copy(out[w]);
    }));
  }, []);
};

Digraph.prototype.inEdges = function(v) {
  var ctx = this._getNodeCtx(v);
  if (ctx) {
    return util.values(ctx.in).map(util.copy);
  }
};

Digraph.prototype.setEdge = function(v, w, label) {
  if (!this.hasEdge(v, w)) {
    var edge = { v: v, w: w, label: label };
    ++this._numEdges;
    this._updateNodeCtx(v, addAdj("out", w, edge));
    this._updateNodeCtx(w, addAdj("in", v, edge));
  } else {
    // When we add a new edge we share the edge context across both incident
    // nodes. Since the context is shared, we only need to update it once!
    var nodeCtx = this._nodes[v];
    nodeCtx.out[w].label = label;
  }
  return this;
};

Digraph.prototype.updateEdge = function(v, w, updater) {
  return this.setEdge(v, w, updater(this.getEdge(v, w)));
};

Digraph.prototype.deleteEdge = function(v, w) {
  if (this.hasEdge(v, w)) {
    --this._numEdges;
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

Digraph.prototype._getEdgeCtx = function(v, w) {
  var ctx = this._getNodeCtx(v);
  if (ctx) {
    return ctx.out[w] || undefined;
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

function setLabel(label) {
  return function(ctx) {
    ctx.label = label;
  };
}

function addAdj(type, v, edge) {
  return function(ctx) {
    ctx[type][v] = edge;
  };
}

function delAdj(type, v) {
  return function(ctx) {
    delete ctx[type][v];
  };
}
