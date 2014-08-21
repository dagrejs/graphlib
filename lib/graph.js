var _ = require("lodash"),
    nodeBehavior = require("./node-behavior");

module.exports = Graph;

function Graph() {
  this._numEdges = 0;

  // v -> label
  this._nodes = {};

  // v -> w -> label, v <= w
  this._edges = {};
}

_.extend(Graph.prototype, nodeBehavior);


/* === Graph-level functions ========== */

Graph.prototype.copy = function() {
  var dest = new Graph();
  this._copyTo(dest);
  dest._numEdges = this._numEdges;
  dest._edges = _.mapValues(this._edges, _.clone);
  return dest;
};

Graph.prototype.numEdges = function() {
  return this._numEdges;
};

Graph.prototype.edges = function() {
  var i = 0;
  return _.transform(this._edges, function(acc, edges) {
    return _.each(edges, function(edge) {
      acc[i++] = edge;
    });
  }, new Array(this._numEdges));
};


/* === Node-level functions ========== */

Graph.prototype._onAddNode = function(v) {
  this._edges[v] = {};
};

Graph.prototype._onRemoveNode = function(v) {
  this._numEdges -= _.size(this._edges[v]);
  delete this._edges[v];
};

Graph.prototype.neighbors = function(v) {
  var edges = this._edges[v];
  return edges && _.keys(edges);
};


/* === Edge-level functions ========== */

Graph.prototype.setEdge = function(v, w, label) {
  var newNode = false;

  if (v > w) {
    var tmp = v;
    v = w;
    w = tmp;
  }

  if (!_.has(this._nodes, v)) {
    this.set(v);
    newNode = true;
  }

  if (!_.has(this._nodes, w)) {
    this.set(w);
    newNode = true;
  }

  if (newNode || !_.has(this._edges[v], w)) {
    ++this._numEdges;
  }

  var edgeCtx = { v: v, w: w, label: label };
  Object.freeze(edgeCtx);
  this._edges[v][w] = edgeCtx;

  return this;
};

Graph.prototype.updateEdge = function(v, w, updater) {
  return this.setEdge(v, w, updater(this.getEdge(v, w)));
};

Graph.prototype.removeEdge = function(v, w) {
  if (v > w) {
    var tmp = v;
    v = w;
    w = tmp;
  }

  var edges = this._edges[v];

  if (edges) {
    if (_.has(edges, w)) {
      --this._numEdges;
    }

    delete edges[w];
  }

  return this;
};

Graph.prototype.getEdge = function(v, w) {
  if (v > w) {
    var tmp = v;
    v = w;
    w = tmp;
  }

  var edges = this._edges[v];
  if (edges) {
    var edge = edges[w];
    return edge && edge.label;
  }
};

Graph.prototype.hasEdge = function(v, w) {
  return !!this.getEdge(v, w);
};
