var Digraph = require("./digraph"),
    Graph = require("./graph"),
    baseCompoundGraph = require("./base-compound-graph");

module.exports = CGraph;

function CGraph() {
  Graph.call(this);

  // Graph with each edge representing a "parent of" relationship. This is
  // actually a forest, but you can image the root being "undefined" and thus
  // all sources have the root as their parent.
  this._nestingTree = new Digraph();
}

CGraph.prototype = new Graph();
CGraph.prototype.constructor = CGraph;

baseCompoundGraph.mixin(CGraph.prototype);
