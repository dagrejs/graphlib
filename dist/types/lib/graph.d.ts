import type { Edge, EdgeLabelFactory, GraphOptions, NodeLabelFactory } from './types';
export declare class Graph<GraphLabel = any, NodeLabel = any, EdgeLabel = any> {
    private _isDirected;
    private _isMultigraph;
    private _isCompound;
    private _label;
    private _nodes;
    private _in;
    private _preds;
    private _out;
    private _sucs;
    private _edgeObjs;
    private _edgeLabels;
    private _nodeCount;
    private _edgeCount;
    private _parent?;
    private _children?;
    constructor(opts?: GraphOptions);
    /**
     * Whether graph was created with 'directed' flag set to true or not.
     *
     * @returns whether the graph edges have an orientation.
     */
    isDirected(): boolean;
    /**
     * Whether graph was created with 'multigraph' flag set to true or not.
     *
     * @returns whether the pair of nodes of the graph can have multiple edges.
     */
    isMultigraph(): boolean;
    /**
     * Whether graph was created with 'compound' flag set to true or not.
     *
     * @returns whether a node of the graph can have subnodes.
     */
    isCompound(): boolean;
    /**
     * Sets the label of the graph.
     *
     * @param label - label value.
     * @returns the graph, allowing this to be chained with other functions.
     */
    setGraph(label: GraphLabel): this;
    /**
     * Gets the graph label.
     *
     * @returns currently assigned label for the graph or undefined if no label assigned.
     */
    graph(): GraphLabel;
    /**
     * Sets the default node label. This label will be assigned as default label
     * in case if no label was specified while setting a node.
     * Complexity: O(1).
     *
     * @param labelOrFn - default node label or label factory function.
     * @returns the graph, allowing this to be chained with other functions.
     */
    setDefaultNodeLabel(labelOrFn: NodeLabel | NodeLabelFactory<NodeLabel>): this;
    /**
     * Gets the number of nodes in the graph.
     * Complexity: O(1).
     *
     * @returns nodes count.
     */
    nodeCount(): number;
    /**
     * Gets all nodes of the graph. Note, the in case of compound graph subnodes are
     * not included in list.
     * Complexity: O(1).
     *
     * @returns list of graph nodes.
     */
    nodes(): string[];
    /**
     * Gets list of nodes without in-edges.
     * Complexity: O(|V|).
     *
     * @returns the graph source nodes.
     */
    sources(): string[];
    /**
     * Gets list of nodes without out-edges.
     * Complexity: O(|V|).
     *
     * @returns the graph sink nodes.
     */
    sinks(): string[];
    /**
     * Invokes setNode method for each node in names list.
     * Complexity: O(|names|).
     *
     * @param names - list of nodes names to be set.
     * @param label - value to set for each node in list.
     * @returns the graph, allowing this to be chained with other functions.
     */
    setNodes(names: string[], label?: NodeLabel): this;
    /**
     * Creates or updates the value for the node v in the graph. If label is supplied
     * it is set as the value for the node. If label is not supplied and the node was
     * created by this call then the default node label will be assigned.
     * Complexity: O(1).
     *
     * @param name - node name.
     * @param label - value to set for node.
     * @returns the graph, allowing this to be chained with other functions.
     */
    setNode(name: string, label?: NodeLabel): this;
    /**
     * Gets the label of node with specified name.
     * Complexity: O(|V|).
     *
     * @param name - node name.
     * @returns label value of the node.
     */
    node(name: string): NodeLabel;
    /**
     * Detects whether graph has a node with specified name or not.
     *
     * @param name - name of the node.
     * @returns true if graph has node with specified name, false - otherwise.
     */
    hasNode(name: string): boolean;
    /**
     * Remove the node with the name from the graph or do nothing if the node is not in
     * the graph. If the node was removed this function also removes any incident
     * edges.
     * Complexity: O(1).
     *
     * @param name - name of the node.
     * @returns the graph, allowing this to be chained with other functions.
     */
    removeNode(name: string): this;
    /**
     * Sets node parent for node v if it is defined, or removes the
     * parent for v if p is undefined. Method throws an exception in case of
     * invoking it in context of noncompound graph.
     * Average-case complexity: O(1).
     *
     * @param v - node to be child for p.
     * @param parent - node to be parent for v.
     * @returns the graph, allowing this to be chained with other functions.
     */
    setParent(v: string, parent?: string): this;
    /**
     * Gets parent node for node v.
     * Complexity: O(1).
     *
     * @param v - node to get parent of.
     * @returns parent node name or void if v has no parent.
     */
    parent(v: string): string | void;
    /**
     * Gets list of direct children of node v.
     * Complexity: O(1).
     *
     * @param v - node to get children of.
     * @returns children nodes names list.
     */
    children(v?: string): string[];
    /**
     * Return all nodes that are predecessors of the specified node or undefined if node v is not in
     * the graph. Behavior is undefined for undirected graphs - use neighbors instead.
     * Complexity: O(|V|).
     *
     * @param v - node identifier.
     * @returns node identifiers list or undefined if v is not in the graph.
     */
    predecessors(v: string): void | string[];
    /**
     * Return all nodes that are successors of the specified node or undefined if node v is not in
     * the graph. Behavior is undefined for undirected graphs - use neighbors instead.
     * Complexity: O(|V|).
     *
     * @param v - node identifier.
     * @returns node identifiers list or undefined if v is not in the graph.
     */
    successors(v: string): void | string[];
    /**
     * Return all nodes that are predecessors or successors of the specified node or undefined if
     * node v is not in the graph.
     * Complexity: O(|V|).
     *
     * @param v - node identifier.
     * @returns node identifiers list or undefined if v is not in the graph.
     */
    neighbors(v: string): void | string[];
    isLeaf(v: string): boolean;
    /**
     * Creates new graph with nodes filtered via filter. Edges incident to rejected node
     * are also removed. In case of compound graph, if parent is rejected by filter,
     * than all its children are rejected too.
     * Average-case complexity: O(|E|+|V|).
     *
     * @param filter - filtration function detecting whether the node should stay or not.
     * @returns new graph made from current and nodes filtered.
     */
    filterNodes(filter: (v: string) => boolean): this;
    /**
     * Sets the default edge label. This label will be assigned as default label
     * in case if no label was specified while setting an edge.
     * Complexity: O(1).
     *
     * @param labelOrFn - default edge label or label factory function.
     * @returns the graph, allowing this to be chained with other functions.
     */
    setDefaultEdgeLabel(labelOrFn: EdgeLabel | EdgeLabelFactory<EdgeLabel>): this;
    /**
     * Gets the number of edges in the graph.
     * Complexity: O(1).
     *
     * @returns edges count.
     */
    edgeCount(): number;
    /**
     * Gets edges of the graph. In case of compound graph subgraphs are not considered.
     * Complexity: O(|E|).
     *
     * @returns graph edges list.
     */
    edges(): Edge[];
    /**
     * Establish an edges path over the nodes in nodes list. If some edge is already
     * exists, it will update its label, otherwise it will create an edge between pair
     * of nodes with label provided or default label if no label provided.
     * Complexity: O(|nodes|).
     *
     * @param nodes - list of nodes to be connected in series.
     * @param label - value to set for each edge between pairs of nodes.
     * @returns the graph, allowing this to be chained with other functions.
     */
    setPath(nodes: string[], label?: EdgeLabel): this;
    /**
     * Creates or updates the label for the edge (v, w) with the optionally supplied
     * name. If label is supplied it is set as the value for the edge. If label is not
     * supplied and the edge was created by this call then the default edge label will
     * be assigned. The name parameter is only useful with multigraphs.
     * Complexity: O(1).
     *
     * @param v - edge source node.
     * @param w - edge sink node.
     * @param label - value to associate with the edge.
     * @param name - unique name of the edge in order to identify it in multigraph.
     * @returns the graph, allowing this to be chained with other functions.
     */
    setEdge(v: string, w: string, label?: EdgeLabel, name?: string): this;
    /**
     * Creates or updates the label for the specified edge. If label is supplied it is
     * set as the value for the edge. If label is not supplied and the edge was created
     * by this call then the default edge label will be assigned. The name parameter is
     * only useful with multigraphs.
     * Complexity: O(1).
     *
     * @param edge - edge descriptor.
     * @param label - value to associate with the edge.
     * @returns the graph, allowing this to be chained with other functions.
     */
    setEdge(edge: Edge, label?: EdgeLabel): this;
    /**
     * Gets the label for the specified edge.
     * Complexity: O(1).
     *
     * @param v - edge source node.
     * @param w - edge sink node.
     * @param name - name of the edge (actual for multigraph).
     * @returns value associated with specified edge.
     */
    edge(v: string, w: string, name?: string): EdgeLabel;
    /**
     * Gets the label for the specified edge.
     * Complexity: O(1).
     *
     * @param edge - edge descriptor.
     * @returns value associated with specified edge.
     */
    edge(edge: Edge): EdgeLabel;
    /**
     * Gets the label for the specified edge and converts it to an object.
     * Complexity: O(1).
     *
     * @param v - edge source node.
     * @param w - edge sink node.
     * @param name - name of the edge (actual for multigraph).
     * @returns value associated with specified edge.
     */
    edgeAsObj(v: string, w: string, name?: string): {
        label: EdgeLabel;
    };
    /**
     * Gets the label for the specified edge and converts it to an object.
     * Complexity: O(1).
     *
     * @param edge - edge descriptor.
     * @returns value associated with specified edge.
     */
    edgeAsObj(edge: Edge): {
        label: EdgeLabel;
    };
    /**
     * Detects whether the graph contains specified edge or not. No subgraphs are considered.
     * Complexity: O(1).
     *
     * @param v - edge source node.
     * @param w - edge sink node.
     * @param name - name of the edge (actual for multigraph).
     * @returns whether the graph contains the specified edge or not.
     */
    hasEdge(v: string, w: string, name?: string): boolean;
    /**
     * Detects whether the graph contains specified edge or not. No subgraphs are considered.
     * Complexity: O(1).
     *
     * @param edge - edge descriptor.
     * @returns whether the graph contains the specified edge or not.
     */
    hasEdge(edge: Edge): boolean;
    /**
     * Removes the specified edge from the graph. No subgraphs are considered.
     * Complexity: O(1).
     *
     * @param v - edge source node.
     * @param w - edge sink node.
     * @param name - name of the edge (actual for multigraph).
     * @returns the graph, allowing this to be chained with other functions.
     */
    removeEdge(v: string, w: string, name?: string): this;
    /**
     * Removes the specified edge from the graph. No subgraphs are considered.
     * Complexity: O(1).
     *
     * @param edge - edge descriptor.
     * @returns the graph, allowing this to be chained with other functions.
     */
    removeEdge(edge: Edge): this;
    /**
     * Return all edges that point to the node v. Optionally filters those edges down to just those
     * coming from node u. Behavior is void for undirected graphs - use nodeEdges instead.
     * Complexity: O(|E|).
     *
     * @param v - edge sink node.
     * @param w - edge source node.
     * @returns edges descriptors list if v is in the graph, or void otherwise.
     */
    inEdges(v: string, w?: string): void | Edge[];
    /**
     * Return all edges that are pointed at by node v. Optionally filters those edges down to just
     * those point to w. Behavior is void for undirected graphs - use nodeEdges instead.
     * Complexity: O(|E|).
     *
     * @param v - edge source node.
     * @param w - edge sink node.
     * @returns edges descriptors list if v is in the graph, or void otherwise.
     */
    outEdges(v: string, w?: string): void | Edge[];
    /**
     * Returns all edges to or from node v regardless of direction. Optionally filters those edges
     * down to just those between nodes v and w regardless of direction.
     * Complexity: O(|E|).
     *
     * @param v - edge adjacent node.
     * @param w - edge adjacent node.
     * @returns edges descriptors list if v is in the graph, or void otherwise.
     */
    nodeEdges(v: string, w?: string): void | Edge[];
    private _defaultNodeLabelFn;
    private _defaultEdgeLabelFn;
    private _removeFromParentsChildList;
    private filterEdges;
}
//# sourceMappingURL=graph.d.ts.map