v0.1.0
======

This release introduces **backwards incompatible** changes.

* `Graph` was renamed to `Digraph` in v0.0.4. This release removes `Graph`.
  Please use `Digraph` in its place.
* `Digraph.edges` no longer takes 2 arguments. The equivalent to
  `Digraph.edges(u, v)` is now `Digraph.outEdges(u, v)`.

The following are backwards compatible changes:

* Added a new optional parameter to `Digraph.outEdges` to filter the results by
  the source node. See API documentation for details.
* Added a new optional parameter to `Digraph.inEdges` to filter the results by
  the target node. See API documentation for details.

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
