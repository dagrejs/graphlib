module.exports = Digraph;

function Digraph() {
  this._numNodes = 0;
  this._nodes = {};
}

Digraph.prototype.numNodes = function() {
  return this._numNodes;
};

Digraph.prototype.nodes = function() {
  return [];
};

Digraph.prototype.nodeIds = function() {
  return Object.keys(this._nodes);
};

Digraph.prototype.set = function(v, label) {
  var ctx = this._nodes[v];
  if (!ctx) {
    ++this._numNodes;
    ctx = this._nodes[v] = {};
  }
  ctx.label = label;
  return this;
};

Digraph.prototype.update = function(v, updater) {
  this.set(v, updater(this.get(v)));
  return this;
};

Digraph.prototype.delete = function(v) {
  var nodes = this._nodes;
  if (nodes[v]) {
    --this._numNodes;
  }
  delete nodes[v];
  return this;
};

Digraph.prototype.get = function(v) {
  var ctx = this._nodes[v];
  if (ctx) {
    return ctx.label;
  }
};

Digraph.prototype.has = function(v) {
  return !!this._nodes[v];
};
