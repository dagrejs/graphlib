var _ = require("lodash");

exports.mixin = mixin;

/*
 * Mixes in compound behavior into a graph prototype. The graph prototype's
 * construct must create a "_nestingTree" property that is a Digraph.
 */
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

  var superCopy = prototype.copy;
  prototype.copy = function() {
    var copy = superCopy.call(this);
    copy._nestingTree = this._nestingTree.copy();
    return copy;
  };

  prototype.filterNodes = function(predicate) {
    var copy = this._copyInit();

    function dfs(v) {
      var label = this.getNode(v);
      if (predicate(v, label)) {
        copy.setNode(v, label);
        copy.setParent(v, this.getParent(v));
        _.each(this.getChildren(v), dfs, this);
      }
    }
    _.each(this.getChildren(), dfs, this);

    this._fnCopyEdges(copy);

    return copy;
  };

  var superOnAddNode = prototype._onAddNode;
  prototype._onAddNode = function(v) {
    superOnAddNode.call(this, v);
    this._nestingTree.setNode(v);
  };

  var superOnRemoveNode = prototype._onRemoveNode;
  prototype._onRemoveNode = function(v) {
    _.each(this._nestingTree.successors(v), function(w) {
      this.removeNode(w);
    }, this);
    this._nestingTree.removeNode(v);
    superOnRemoveNode.call(this, v);
  };
}
