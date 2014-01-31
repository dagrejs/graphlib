v0.7.4
======

* Do not use object literal with null key - it breaks in IE8.

v0.7.3
======

* Pull in cp-data v1.1.3

v0.7.2
======

* Pull in cp-data v1.1.2

v0.7.1
======

* Some small perf improvements to the dijkstra algorithms.

v0.7.0
======

* Remove data.PriorityQueue. Use `cp-data` to get PriorityQueue.
* Remove usage of `cp-set`. We now use `cp-data` instead.

v0.6.0
======

*broken build* - please do not use this release.

* Graph toString() is not longer included in error messages. In most cases its
  excessive verbosity made it difficult to debug errors in the Chrome debugger.
* No longer expose data.Set and data.PriorityQueue from graphlib. The former is
  now available in the `cp-set` npm module. The later can be made available in
  a similar way if necessary.

v0.5.12
=======

* assert.deepEqual(g.copy(), g) now returns true.

v0.5.11
=======

* ~5x speedup for filterNodes.

v0.5.10
=======

* Doc fixes.
* Some performance improvement to delNode and filterNodes.

v0.5.9
======

* Added preorder and postorder tree traversal functions.

v0.5.8
======

* Fixed bug where graph value was not copied correctly with graph.copy().

v0.5.7
======

* Fix toString, copy, filterNodes for compound graphs.

v0.5.6
======

* `components` now works for directed graphs.

v0.5.5
======

* Rely less on instanceof checks which may fail with different versions of the
  library loaded.

v0.5.4
======

* Added a JSON encoder / decoder

v0.5.3
======

* Fixed bug where removing a node would not remove it from its parent's
  children set.

v0.5.2
======

* Fixed bug where addNode would use `{}` as the default value if a initial
  value was not assigned.
* Fixed bug where auto-assiged id was not used correcty in compound graphs.

v0.5.1
======

* `addNode` now behaves like `addEdge` in that it assigns a unique id to the
  node if the given id was `undefined` or `null`.

v0.5.0
======

The release introduces these **backwards incompatible** changes:

* Removed `equals` from `Graph` and `Digraph`. This was used for test only. Use
  `assert.deepEqual` instead.

This release also introduces compound graphs. See the API docs for `CGraph` and
`CDigraph` for details.

v0.4.2
======

* No externally visible changes.

v0.4.1
======

* `(di)graph.addEdge(...)` now returns the id of the edge added.
* Fix bug where auto-assigned edge ids could collide with existing edge ids.

v0.4.0
======

This release introduces **backwards incompatible** changes.

`subgraph` has been removed. Instead of:

```js
graph.subgraph([1, 2, 3]);
```

Use:

```js
var filter = require("graphlib").filter;
graph.filterNodes(filter.nodesFromList([1, 2, 3]));
```

The following are backwards compatible changes:

* Introduced `graph.filterNodes` for creating a new graph by applying a filter
  to nodes in `graph`.
* Add a new module `filter` that includes some simple filters.

v0.3.3
======

* More doc improvements.

v0.3.2
======

* Initial pass at nicer documentation.

v0.3.1
======

* @solleks fixed a bug in which `alg.floydWarshall` could return the wrong
  shortest path with multiple edges between the same nodes (#10).

v0.3.0
======

* Added Prim's Algorithm (`alg.prim`).
* Added method to change a directed graph to an undirected graph
  (`Digraph.asUndirected`).
* Added method to change an undirected graph to a directed graph
  (`Graph.asDirected`).

v0.2.1
======

* Added algorithm for finding connected components in an undirected Graph
  (`alg.components`).
* Added Floyd-Warshall algorithm (`alg.floydWarshall`).

v0.2.0
======

* Added an undirected multi-graph implementation (`Graph`).
* Added a Set datatype (`data.Set`).

v0.1.1
======

* Added Dijkstra's Algorithm (`alg.dijkstra`) for finding all single source
  shortest paths.
* Added `alg.dijkstraAll` for finding all shortest paths.

v0.1.0
======

This release introduces **backwards incompatible** changes.

* `Graph` was renamed to `Digraph` in v0.0.4. This release removes `Graph`.
  Please use `Digraph` in its place.
* `Digraph.edges` no longer takes any arguments. It always returns all edges in
  the graph.
    * The equivalent of `Digraph.edges(u)` is now `Digraph.incidentEdges(u)`.
    * The equivalent of `Digraph.edges(u, v)` is now `Digraph.outEdges(u, v)`
      or `Digraph.inEdges(v, u)`.

The following are backwards compatible changes:

* Added a new optional parameter to `Digraph.outEdges` to filter the results by
  the source node. See API documentation for details.
* Added a new optional parameter to `Digraph.inEdges` to filter the results by
  the target node. See API documentation for details.
* Added a new method, `Digraph.incidentEdges`, that returns all edges incident
  on a node `u` with `Digraph.incidentEdges(u)` or all edges between two nodes -
  regardless of direction - with `Digraph.incidentEdges(u, v)`.

v0.0.6
======

* Add an min priority queue (data.PriorityQeuue).

v0.0.5
======

* Add an implementation of Tarjan's algorithm (alg.tarjan).
* Add a function to find and return all cycles in a graph (alg.findCycles).

v0.0.4
======

* Added a value to the graph itself, similar to the values for nodes and edges.
  Use `Digraph.graph()` to get the value and `Digraph.graph(x)` to set the
  graph's value to `x`.
* Added support for changing the value of node's and edge's by supply
  additional value argument. For example, to set the value `x` on node `u`,
  call `Digraph.node(u, x)`.

v0.0.3
======

* Renamed Graph to Digraph. Graph is now an alias to Digraph, but will be
  removed in a subsequent release.

v0.0.2
======

* Added `sources` and `sinks` to Graph.
* Added topsort algorithm.
* Added isAcyclic algorithm.

v0.0.1
======

* Initial release.
