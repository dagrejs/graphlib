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
