var _ = require("lodash");

module.exports = Digraph;

// Implementation notes:
//
// Everything is reachable through the _nodes field, which is a map of
//
//    id -> { in :: Object, v, label, out :: Object }
//
// The in and out fields are objects that hold in- and out-edges respectively,
// with the following structure:
//
//    otherId -> { v, w, label }
//
// The object pointed to is shared by both nodes incident on the edge, which
// allows for some optimizations. This invariant must hold under all
// operations.

function Digraph() {
  this._numNodes = 0;
  this._numEdges = 0;
  this._nodes = {};
}

Digraph.prototype.copy = function() {
  var copy = new Digraph();
  copy._numNodes = this._numNodes;
  copy._numEdges = this._numEdges;
  copy._nodes = _.mapValues(this._nodes, function(ctx) {
    var edgeCache = {},
        inEdges = copyEdgeCtxs(ctx.in, edgeCache),
        outEdges = copyEdgeCtxs(ctx.out, edgeCache);
    return { in: inEdges, v: ctx.v, label: ctx.label, out: outEdges };
  });
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
      return _.clone(out[w]);
    }));
  }, []);
};

Digraph.prototype.inEdges = function(v) {
  var ctx = this._getNodeCtx(v);
  if (ctx) {
    return _.map(_.values(ctx.in), _.clone);
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

/** Helper for use with Digraph.copy */
function copyEdgeCtxs(edgeCtxs, edgeCache) {
  return _.mapValues(edgeCtxs, function(edgeCtx) {
    var v = edgeCtx.v,
        w = edgeCtx.w,
        key = v.length + v + w,
        cachedCtx = edgeCache[key];
    if (!cachedCtx) {
      cachedCtx = edgeCache[key] = { v: v, w: w, label: edgeCtx.label };
    }
    return cachedCtx;
  });
}

/** Helpers for use with updateNodeCtx */
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
