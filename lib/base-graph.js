var _ = require("lodash");

module.exports = BaseGraph;

function BaseGraph(inEdges, outEdges, sources, sinks) {
  // v -> label
  this._nodes = {};

  // v -> u -> label
  this._inEdges = inEdges;

  // v -> w -> label
  this._outEdges = outEdges;

  // v -> true
  this._sources = sources;

  // v -> true
  this._sinks = sinks;
}

/* Number of nodes in the graph. Should only be changed by the implementation. */
BaseGraph.prototype._nodeCount = 0;

/* Number of edges in the graph. Should only be changed by the implementation. */
BaseGraph.prototype._edgeCount = 0;


/* === Graph-level functions ========== */

BaseGraph.prototype.copy = function() {
  var copy = this._copyInit();
  copy._nodeCount = this._nodeCount;
  copy._edgeCount = this._edgeCount;
  copy._nodes = _.clone(this._nodes);
  copy._inEdges = _.mapValues(this._inEdges, _.clone);
  copy._outEdges = _.mapValues(this._outEdges, _.clone);
  copy._sources = _.clone(this._sources);
  copy._sinks = _.clone(this._sinks);
  return copy;
};

/*
 * Internal function used to create the initial graph during a copy operation.
 */
BaseGraph.prototype._copyInit = function() {
  var copy = new this.constructor();
  if (this._graphLabel) {
    copy._graphLabel = this._graphLabel;
  }
  return copy;
};

BaseGraph.prototype.filterNodes = function(predicate) {
  var copy = this._copyInit();
  _.each(this.nodes(), function(node) {
    if (predicate(node.v, node.label)) {
      copy.setNode(node.v, node.label);
    }
  });
  this._fnCopyEdges(copy);
  return copy;
};

/*
 * Internal function used by filterNodes (fn) to copy to the destination graph
 * all edges that have both incident nodes in the destination graph.
 */
BaseGraph.prototype._fnCopyEdges = function(dest) {
  _.each(this.edges(), function(edge) {
    if (_.has(dest._nodes, edge.v) && _.has(dest._nodes, edge.w)) {
      dest.setEdge(edge.v, edge.w, edge.label);
    }
  });
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

BaseGraph.prototype.updateGraph = function(fn) {
  return this.setGraph(fn(this.getGraph()));
};

BaseGraph.prototype.nodeCount = function() {
  return this._nodeCount;
};

BaseGraph.prototype.nodes = function() {
  var i = 0;
  return _.transform(this._nodes, function(acc, v, k) {
    acc[i++] = { v: k, label: v };
  }, new Array(this._nodeCount));
};

BaseGraph.prototype.nodeIds = function() {
  return _.keys(this._nodes);
};

BaseGraph.prototype.sources = function() {
  return _.keys(this._sources);
};

BaseGraph.prototype.sinks = function() {
  return _.keys(this._sinks);
};

BaseGraph.prototype.edgeCount = function() {
  return this._edgeCount;
};

BaseGraph.prototype.edges = function() {
  var i = 0;
  return _.transform(this._outEdges, function(acc, vOut) {
    _.each(vOut, function(edge) {
      acc[i++] = edge;
    });
  }, new Array(this._edgeCount));
};


/* === Node-level functions ========== */

BaseGraph.prototype.setNode = function(v, label) {
  var nodes = this._nodes;
  if (!_.has(nodes, v)) {
    this._inEdges[v] = {};
    this._outEdges[v] = {};
    this._sources[v] = this._sinks[v] = true;
    nodes[v] = label;
    ++this._nodeCount;
    this._onAddNode(v);
  } else if (arguments.length > 1) {
    nodes[v] = label;
  }
  return this;
};

BaseGraph.prototype.setNodes = function(vs, label) {
  var args = arguments;
  _.each(vs, function(v) {
    if (args.length > 1) {
      if (_.isFunction(label)) {
        this.setNode(v, label(v));
      } else {
        this.setNode(v, label);
      }
    } else {
      this.setNode(v);
    }
  }, this);
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
    delete this._sources[v];
    delete this._sinks[v];
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
  this.setNode(v);
  this.setNode(w);

  var outV = this._outEdges[v],
      prevCtx = outV[w];
  if (prevCtx === undefined) {
    ++this._edgeCount;
  }

  var edgeCtx = { v: String(v), w: String(w) };
  if (arguments.length <= 2) {
    if (_.has(prevCtx, "label")) {
      edgeCtx.label = prevCtx.label;
    }
  } else if (label !== undefined) {
    edgeCtx.label = label;
  }
  Object.freeze(edgeCtx);
  outV[w] = this._inEdges[w][v] = edgeCtx;

  delete this._sources[w];
  delete this._sinks[v];

  return this;
};

BaseGraph.prototype.setPath = function(vs, label) {
  var self = this,
      args = arguments;
  _.reduce(vs, function(v, w) {
    if (args.length > 1) {
      self.setEdge(v, w, label);
    } else {
      self.setEdge(v, w);
    }
    return w;
  });
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

    if (_.isEmpty(vOut)) {
      this._sinks[v] = true;
    }

    if (_.isEmpty(wIn)) {
      this._sources[w] = true;
    }
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
  return _.has(this._outEdges[v], w);
};
