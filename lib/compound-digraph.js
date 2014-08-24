var _ = require("lodash"),
    Digraph = require("./digraph");

module.exports = CDigraph;

function CDigraph() {
  Digraph.call(this);

  // Graph with each edge representing a "parent of" relationship. This is
  // actually a forest, but you can image the root being "undefined" and thus
  // all sources have the root as their parent.
  this._nestingTree = new Digraph();
}

CDigraph.prototype = new Digraph();
CDigraph.prototype.constructor = CDigraph;

CDigraph.prototype.setParent = function(v, parent) {
  if (!this.hasNode(v)) {
    this.setNode(v);
  }

  if (!this.hasNode(parent)) {
    this.setNode(parent);
  }

  // Preserve the tree invariant
  var ancestor = parent;
  while (ancestor) {
    if (ancestor === v) {
      throw new Error("Setting " + parent + " as parent of " + v +
                      " would create a cycle");
    }
    ancestor = this.getParent(ancestor);
  }

  this._nestingTree.setEdge(parent, v);
};

CDigraph.prototype.getParent = function(v) {
  var parent = this._nestingTree.predecessors(v);
  if (parent.length) {
    return parent[0];
  }
};

CDigraph.prototype.getChildren = function(v) {
  if (v === undefined) {
    return this._nestingTree.sources();
  }
  return this._nestingTree.successors(v);
};

CDigraph.prototype.getNestingTree = function() {
  return this._nestingTree.copy();
};

CDigraph.prototype._onAddNode = function(v) {
  Digraph.prototype._onAddNode.call(this, v);
  this._nestingTree.setNode(v);
};

CDigraph.prototype._onRemoveNode = function(v) {
  _.each(this._nestingTree.successors(v), function(w) {
    this.removeNode(w);
  }, this);
  Digraph.prototype._onRemoveNode.call(this, v);
};
