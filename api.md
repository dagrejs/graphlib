# graphlib api documentation

## new Graph()
A directed multi-graph.

### Subgraph(us)

Constructs and returns a new graph that includes only the nodes in `us`. Any
edges that have both their source and target in the set `us` are also
included in the subgraph.
 
Changes to the graph itself are not reflected in the original graph.
However, the values for nodes and edges are not copied. If the values are
objects then their changes will be reflected in the original graph and the
subgraph.
 
If any of the nodes in `us` are not in this graph this function raises an
Error.

### Graph#order()
Returns the number of nodes in this graph.

### Graph#size
Returns the number of edges in this graph.

### Graph#hasNode(u)
Returns `true` if this graph contains a node with the id `u`. Otherwise
returns false.

### Graph#node(u)
Returns the value for a node in the graph with the id `u`. If no such node
is in the graph this function will throw an Error.

### Graph#nodes()
Returns the ids of all nodes in this graph. Use `graph.node(u)` to get the
value for a specific node.

### Graph#eachNode(func)
Applies a function that takes the parameters (`id`, `value`) to each node in
the graph in arbitrary order.

### Graph#successors(u)

Returns all successors of the node with the id `u`. That is, all nodes
that have the node `u` as their source are returned.
 
If no node `u` exists in the graph this function throws an Error.

### Graph#predecessors(u)

Returns all predecessors of the node with the id `u`. That is, all nodes
that have the node `u` as their target are returned.
 
If no node `u` exists in the graph this function throws an Error.

### Graph#neighbors(u)

Returns all nodes that are adjacent to the node with the id `u`. In other
words, this function returns the set of all successors and predecessors of
node `u`.

### Graph#sources()

Returns all nodes in the graph that have no in-edges.

### Graph#sinks()

Returns all nodes in the graph that have no out-edges.

### Graph#hasEdge(e)

Returns `true` if this graph has an edge with the id `e`. Otherwise this
function returns `false`.

### Graph#edge(e)
Returns the value for an edge with the id `e`. If no such edge exists in
the graph this function throws an Error.

### Graph#edges(u, v)
Return all edges with no arguments,
the ones that are incident on a node (one argument),
or all edges from a source to a target (two arguments)

### Graph#eachEdge(func)
Applies a function that takes the parameters (`id`, `source`, `target`,
`value`) to each edge in this graph in arbitrary order.

### Graph#source(e)
Returns the source node incident on the edge identified by the id `e`. If no
such edge exists in the graph this function throws an Error.

### Graph#target(e)
Returns the target node incident on the edge identified by the id `e`. If no
such edge exists in the graph this function throws an Error.

### Graph#inEdges(target)
Returns the ids of all edges in the graph that have the node `target` as
their target. If the node `target` is not in the graph this function raises
an Error.

### Graph#outEdges(source)
Returns the ids of all nodes in the graph that have the node `source` as
their source. If the node `source` is not in the graph this function raises
an Error.

### Graph#equals(other)
returns true if the values oof all nodes and all edges are equal (===)

### Graph#toString()
Returns a string representation of this graph.

### Graph#addNode(u, value)
Adds a new node with the id `u` to the graph and assigns it the value
`value`. If a node with the id is already a part of the graph this function
throws an Error.

### Graph#delNode(u)
Removes a node from the graph that has the id `u`. Any edges incident on the
node are also removed. If the graph does not contain a node with the id this
function will throw an Error.

### Graph#addEdge(e, source, target, value)
Adds a new edge to the graph with the id `e` from a node with the id `source`
to a noce with an id `target` and assigns it the value `value`. This graph
allows more than one edge from `source` to `target` as long as the id `e`
is unique in the set of edges. If `e` is `null` the graph will assign a
unique identifier to the edge.
 
If `source` or `target` are not present in the graph this function will
throw an Error.

### Graph#delEdge(e)
Removes an edge in the graph with the id `e`. If no edge in the graph has
the id `e` this function will throw an Error.
