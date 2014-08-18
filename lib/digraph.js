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
      var edgeCtx = out[w];
      return { v: edgeCtx.v, w: edgeCtx.w, label: edgeCtx.label };
    }));
  }, []);
};

Digraph.prototype.setEdge = function(v, w, label) {
  var edge = { v: v, w: w, label: label };
  if (!this.hasEdge(v, w)) {
    ++this._numEdges;
  }
  this._updateNodeCtx(v, addAdj("out", w, edge));
  this._updateNodeCtx(w, addAdj("in", v, edge));
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
