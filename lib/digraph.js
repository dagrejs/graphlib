var _ = require("lodash");

module.exports = Digraph;

function Digraph() {
  this._numNodes = 0;
  this._numEdges = 0;

  // v -> label
  this._nodes = {};

  // v -> u -> label
  this._inEdges = {};

  // v -> w -> label
  this._outEdges = {};
}

Digraph.prototype.copy = function() {
  var copy = new Digraph();
  copy._numNodes = this._numNodes;
  copy._numEdges = this._numEdges;
  copy._nodes = _.clone(this._nodes);
  copy._inEdges = _.mapValues(this._inEdges, _.clone);
  copy._outEdges = _.mapValues(this._outEdges, _.clone);
  return copy;
};

Digraph.prototype.numNodes = function() {
  return this._numNodes;
};

Digraph.prototype.nodeIds = function() {
  return _.keys(this._nodes);
};

Digraph.prototype.sources = function() {
  var results = [];
  _.forIn(this._inEdges, function(us, v) {
    if (_.isEmpty(us)) {
      results.push(v);
    }
  });
  return results;
};

Digraph.prototype.sinks = function() {
  var results = [];
  _.forIn(this._outEdges, function(ws, v) {
    if (_.isEmpty(ws)) {
      results.push(v);
    }
  });
  return results;
};

Digraph.prototype.set = function(v, label) {
  if (!(v in this._nodes)) {
    this._inEdges[v] = {};
    this._outEdges[v] = {};
    ++this._numNodes;
  }
  this._nodes[v] = label;
  return this;
};

Digraph.prototype.update = function(v, updater) {
  return this.set(v, updater(this.get(v)));
};

Digraph.prototype.delete = function(v) {
  if (v in this._nodes) {
    --this._numNodes;
    delete this._nodes[v];
    _.forIn(this._inEdges[v], function(_, u) {
      --this._numEdges;
      delete this._outEdges[u][v];
    }, this);
    _.forIn(this._outEdges[v], function(_, w) {
      --this._numEdges;
      delete this._inEdges[w][v];
    }, this);
    delete this._inEdges[v];
    delete this._outEdges[v];
  }
  return this;
};

Digraph.prototype.get = function(v) {
  return this._nodes[v];
};

Digraph.prototype.has = function(v) {
  return _.has(this._nodes, v);
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
    _.merge(adjs, this._outEdges[v]);
    return _.keys(adjs);
  }
};

Digraph.prototype.numEdges = function() {
  return this._numEdges;
};

Digraph.prototype.edges = function() {
  var i = 0;
  return _.transform(this._outEdges, function(acc, vOut, v) {
    return _.each(vOut, function(label, w) {
      acc[i++] = { v: v, w: w, label: label };
    });
  }, new Array(this._numEdges));
};

Digraph.prototype.inEdges = function(v) {
  var inEdges = this._inEdges[v];
  if (inEdges) {
    return _.map(inEdges, function(label, u) {
      return { v: u, w: v, label: label };
    });
  }
};

Digraph.prototype.outEdges = function(v) {
  var outEdges = this._outEdges[v];
  if (outEdges) {
    return _.map(outEdges, function(label, w) {
      return { v: v, w: w, label: label };
    });
  }
};

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
    ++this._numEdges;
  }

  this._outEdges[v][w] = this._inEdges[w][v] = label;

  return this;
};

Digraph.prototype.updateEdge = function(v, w, updater) {
  return this.setEdge(v, w, updater(this.getEdge(v, w)));
};

Digraph.prototype.deleteEdge = function(v, w) {
  var vOut = this._outEdges[v],
      wIn = this._inEdges[w];

  if (vOut && wIn) {
    if (_.has(vOut, w)) {
      --this._numEdges;
    }
    delete vOut[w];
    delete wIn[v];
  }

  return this;
};

Digraph.prototype.getEdge = function(v, w) {
  var vOut = this._outEdges[v];
  if (vOut) {
    return vOut[w];
  }
};

Digraph.prototype.hasEdge = function(v, w) {
  return !!this.getEdge(v, w);
};
