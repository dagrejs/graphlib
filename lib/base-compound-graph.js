var _ = require("lodash");

exports.mixin = mixin;

function mixin(prototype) {
  prototype.setParent = function(v, parent) {
    if (!this.hasNode(v)) {
      this.setNode(v);
    }

    if (parent !== undefined && !this.hasNode(parent)) {
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

    _.each(this._nestingTree.predecessors(v), function(u) {
      this._nestingTree.removeEdge(u, v);
    }, this);

    if (parent !== undefined) {
      this._nestingTree.setEdge(parent, v);
    }
  };

  prototype.getParent = function(v) {
    var parent = this._nestingTree.predecessors(v);
    if (parent.length) {
      return parent[0];
    }
  };

  prototype.getChildren = function(v) {
    if (v === undefined) {
      return this._nestingTree.sources();
    }
    return this._nestingTree.successors(v);
  };

  prototype.getNestingTree = function() {
    return this._nestingTree.copy();
  };

  var oldOnAddNode = prototype._onAddNode;
  prototype._onAddNode = function(v) {
    oldOnAddNode.call(this, v);
    this._nestingTree.setNode(v);
  };

  var oldOnRemoveNode = prototype._onRemoveNode;
  prototype._onRemoveNode = function(v) {
    _.each(this._nestingTree.successors(v), function(w) {
      this.removeNode(w);
    }, this);
    this._nestingTree.removeNode(v);
    oldOnRemoveNode.call(this, v);
  };
}
