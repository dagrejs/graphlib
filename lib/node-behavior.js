var _ = require("lodash");

/* Common node behavior that can be mixed into graph implementations. */
module.exports = {
  /* v -> label, must be initialized to {} in implementations */
  _nodeIds: undefined,

  /* Number of nodes in the graph */
  _numNodes: 0,

  /* Invoked when a new node is added. */
  _onAddNode: function() {},

  /* Invoked when a node is removed. */
  _onRemoveNode: function() {},

  /* Copies nodes to a new object. */
  _copyTo: function(dest) {
    dest._numNodes = this._numNodes;
    dest._nodes = _.clone(this._nodes);
  },

  numNodes: function() {
    return this._numNodes;
  },

  nodeIds: function() {
    return _.keys(this._nodes);
  },

  set: function(v, label) {
    if (!_.has(this._nodes, v)) {
      this._onAddNode(v);
      ++this._numNodes;
    }
    this._nodes[v] = label;
    return this;
  },

  update: function(v, updater) {
    return this.set(v, updater(this.get(v)));
  },

  remove: function(v) {
    if (_.has(this._nodes, v)) {
      --this._numNodes;
      delete this._nodes[v];
      this._onRemoveNode(v);
    }
    return this;
  },

  get: function(v) {
    return this._nodes[v];
  },

  has: function(v) {
    return _.has(this._nodes, v);
  }
};
