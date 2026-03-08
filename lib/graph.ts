import type {Edge, EdgeLabelFactory, GraphOptions, NodeLabelFactory} from './types';

const DEFAULT_EDGE_NAME = "\x00";
const GRAPH_NODE = "\x00";
const EDGE_KEY_DELIM = "\x01";

// Implementation notes:
//
//  * Node id query functions should return string ids for the nodes
//  * Edge id query functions should return an "edgeObj", edge object, that is
//    composed of enough information to uniquely identify an edge: {v, w, name}.
//  * Internally we use an "edgeId", a stringified form of the edgeObj, to
//    reference edges. This is because we need a performant way to look these
//    edges up and, object properties, which have string keys, are the closest
//    we're going to get to a performant hashtable in JavaScript.

export class Graph<GraphLabel = any, NodeLabel = any, EdgeLabel = any> {
    private _isDirected: boolean = true;
    private _isMultigraph: boolean = false;
    private _isCompound: boolean = false;

    // Label for the graph itself
    private _label!: GraphLabel;
    // v -> label
    private _nodes: Record<string, NodeLabel> = {};
    // v -> edgeObj
    private _in: Record<string, Record<string, Edge>> = {};
    // u -> v -> Number
    private _preds: Record<string, Record<string, number>> = {};
    // v -> edgeObj
    private _out: Record<string, Record<string, Edge>> = {};
    // v -> w -> Number
    private _sucs: Record<string, Record<string, number>> = {};
    // e -> edgeObj
    private _edgeObjs: Record<string, Edge> = {};
    // e -> label
    private _edgeLabels: Record<string, EdgeLabel> = {};
    /* Number of nodes in the graph. Should only be changed by the implementation. */
    private _nodeCount: number = 0;
    /* Number of edges in the graph. Should only be changed by the implementation. */
    private _edgeCount: number = 0;
    private _parent?: Record<string, string>;
    private _children?: Record<string, Record<string, boolean>>;

    constructor(opts?: GraphOptions) {
        if (opts) {
            this._isDirected = "directed" in opts ? opts.directed! : true;
            this._isMultigraph = "multigraph" in opts ? opts.multigraph! : false;
            this._isCompound = "compound" in opts ? opts.compound! : false;
        }

        if (this._isCompound) {
            // v -> parent
            this._parent = {};

            // v -> children
            this._children = {};
            this._children[GRAPH_NODE] = {};
        }
    }

    /**
     * Whether graph was created with 'directed' flag set to true or not.
     *
     * @returns whether the graph edges have an orientation.
     */
    isDirected(): boolean {
        return this._isDirected;
    }

    /**
     * Whether graph was created with 'multigraph' flag set to true or not.
     *
     * @returns whether the pair of nodes of the graph can have multiple edges.
     */
    isMultigraph(): boolean {
        return this._isMultigraph;
    }

    /* === Graph functions ========= */

    /**
     * Whether graph was created with 'compound' flag set to true or not.
     *
     * @returns whether a node of the graph can have subnodes.
     */
    isCompound(): boolean {
        return this._isCompound;
    }

    /**
     * Sets the label of the graph.
     *
     * @param label - label value.
     * @returns the graph, allowing this to be chained with other functions.
     */
    setGraph(label: GraphLabel): this {
        this._label = label;
        return this;
    }

    /**
     * Gets the graph label.
     *
     * @returns currently assigned label for the graph or undefined if no label assigned.
     */
    graph(): GraphLabel {
        // TODO: This should return undefined if no label was assigned, but that would be a breaking change.
        return this._label;
    }

    /**
     * Sets the default node label. This label will be assigned as default label
     * in case if no label was specified while setting a node.
     * Complexity: O(1).
     *
     * @param labelOrFn - default node label or label factory function.
     * @returns the graph, allowing this to be chained with other functions.
     */
    setDefaultNodeLabel(labelOrFn: NodeLabel | NodeLabelFactory<NodeLabel>): this {
        if (typeof labelOrFn !== 'function') {
            this._defaultNodeLabelFn = () => labelOrFn;
        } else {
            this._defaultNodeLabelFn = labelOrFn as NodeLabelFactory<NodeLabel>;
        }

        return this;
    }

    /**
     * Gets the number of nodes in the graph.
     * Complexity: O(1).
     *
     * @returns nodes count.
     */
    nodeCount(): number {
        return this._nodeCount;
    }


    /* === Node functions ========== */

    /**
     * Gets all nodes of the graph. Note, the in case of compound graph subnodes are
     * not included in list.
     * Complexity: O(1).
     *
     * @returns list of graph nodes.
     */
    nodes(): string[] {
        return Object.keys(this._nodes);
    }

    /**
     * Gets list of nodes without in-edges.
     * Complexity: O(|V|).
     *
     * @returns the graph source nodes.
     */
    sources(): string[] {
        return this.nodes().filter(v => Object.keys(this._in[v]!).length === 0);
    }

    /**
     * Gets list of nodes without out-edges.
     * Complexity: O(|V|).
     *
     * @returns the graph sink nodes.
     */
    sinks(): string[] {
        return this.nodes().filter(v => Object.keys(this._out[v]!).length === 0);
    }

    /**
     * Invokes setNode method for each node in names list.
     * Complexity: O(|names|).
     *
     * @param names - list of nodes names to be set.
     * @param label - value to set for each node in list.
     * @returns the graph, allowing this to be chained with other functions.
     */
    setNodes(names: string[], label?: NodeLabel): this {
        names.forEach((v) => {
            if (label !== undefined) {
                this.setNode(v, label);
            } else {
                this.setNode(v);
            }
        });
        return this;
    }

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
    setNode(name: string, label?: NodeLabel): this {
        if (name in this._nodes) {
            if (arguments.length > 1) {
                this._nodes[name] = label!;
            }
            return this;
        }

        this._nodes[name] = arguments.length > 1 ? label! : this._defaultNodeLabelFn(name);
        if (this._isCompound) {
            this._parent![name] = GRAPH_NODE;
            this._children![name] = {};
            this._children![GRAPH_NODE]![name] = true;
        }
        this._in[name] = {};
        this._preds[name] = {};
        this._out[name] = {};
        this._sucs[name] = {};
        ++this._nodeCount;
        return this;
    }

    /**
     * Gets the label of node with specified name.
     * Complexity: O(|V|).
     *
     * @param name - node name.
     * @returns label value of the node.
     */
    node(name: string): NodeLabel {
        // TODO: This should return undefined if the node doesn't exist, but that would be a breaking change.
        return this._nodes[name]!;
    }

    /**
     * Detects whether graph has a node with specified name or not.
     *
     * @param name - name of the node.
     * @returns true if graph has node with specified name, false - otherwise.
     */
    hasNode(name: string): boolean {
        return name in this._nodes;
    }

    /**
     * Remove the node with the name from the graph or do nothing if the node is not in
     * the graph. If the node was removed this function also removes any incident
     * edges.
     * Complexity: O(1).
     *
     * @param name - name of the node.
     * @returns the graph, allowing this to be chained with other functions.
     */
    removeNode(name: string): this {
        if (name in this._nodes) {
            const removeEdge = (e: string) => this.removeEdge(this._edgeObjs[e]!);
            delete this._nodes[name];
            if (this._isCompound) {
                this._removeFromParentsChildList(name);
                delete this._parent![name];
                this.children(name).forEach((child) => {
                    this.setParent(child);
                });
                delete this._children![name];
            }
            Object.keys(this._in[name]!).forEach(removeEdge);
            delete this._in[name];
            delete this._preds[name];
            Object.keys(this._out[name]!).forEach(removeEdge);
            delete this._out[name];
            delete this._sucs[name];
            --this._nodeCount;
        }
        return this;
    }

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
    setParent(v: string, parent?: string): this {
        if (!this._isCompound) {
            throw new Error("Cannot set parent in a non-compound graph");
        }

        if (parent === undefined) {
            parent = GRAPH_NODE;
        } else {
            // Coerce parent to string
            parent += "";
            for (let ancestor: string | undefined | void = parent; ancestor !== undefined; ancestor = this.parent(ancestor)) {
                if (ancestor === v) {
                    throw new Error("Setting " + parent + " as parent of " + v +
                        " would create a cycle");
                }
            }

            this.setNode(parent);
        }

        this.setNode(v);
        this._removeFromParentsChildList(v);
        this._parent![v] = parent;
        this._children![parent]![v] = true;
        return this;
    }

    /**
     * Gets parent node for node v.
     * Complexity: O(1).
     *
     * @param v - node to get parent of.
     * @returns parent node name or void if v has no parent.
     */
    parent(v: string): string | void {
        if (this._isCompound) {
            const parent = this._parent![v];
            if (parent !== GRAPH_NODE) {
                return parent;
            }
        }
    }

    /**
     * Gets list of direct children of node v.
     * Complexity: O(1).
     *
     * @param v - node to get children of.
     * @returns children nodes names list.
     */
    children(v: string = GRAPH_NODE): string[] {
        if (this._isCompound) {
            const children = this._children![v];
            if (children) {
                return Object.keys(children);
            }
        } else if (v === GRAPH_NODE) {
            return this.nodes();
        } else if (this.hasNode(v)) {
            return [];
        }
        return [];
    }

    /**
     * Return all nodes that are predecessors of the specified node or undefined if node v is not in
     * the graph. Behavior is undefined for undirected graphs - use neighbors instead.
     * Complexity: O(|V|).
     *
     * @param v - node identifier.
     * @returns node identifiers list or undefined if v is not in the graph.
     */
    predecessors(v: string): void | string[] {
        const predsV = this._preds[v];
        if (predsV) {
            return Object.keys(predsV);
        }
    }

    /**
     * Return all nodes that are successors of the specified node or undefined if node v is not in
     * the graph. Behavior is undefined for undirected graphs - use neighbors instead.
     * Complexity: O(|V|).
     *
     * @param v - node identifier.
     * @returns node identifiers list or undefined if v is not in the graph.
     */
    successors(v: string): void | string[] {
        const sucsV = this._sucs[v];
        if (sucsV) {
            return Object.keys(sucsV);
        }
    }

    /**
     * Return all nodes that are predecessors or successors of the specified node or undefined if
     * node v is not in the graph.
     * Complexity: O(|V|).
     *
     * @param v - node identifier.
     * @returns node identifiers list or undefined if v is not in the graph.
     */
    neighbors(v: string): void | string[] {
        const preds = this.predecessors(v);
        if (preds) {
            const union = new Set(preds);
            for (const succ of this.successors(v)!) {
                union.add(succ);
            }

            return Array.from(union.values());
        }
    }

    isLeaf(v: string): boolean {
        let neighbors: string[] | void;
        if (this.isDirected()) {
            neighbors = this.successors(v);
        } else {
            neighbors = this.neighbors(v);
        }
        return neighbors!.length === 0;
    }

    /**
     * Creates new graph with nodes filtered via filter. Edges incident to rejected node
     * are also removed. In case of compound graph, if parent is rejected by filter,
     * than all its children are rejected too.
     * Average-case complexity: O(|E|+|V|).
     *
     * @param filter - filtration function detecting whether the node should stay or not.
     * @returns new graph made from current and nodes filtered.
     */
    filterNodes(filter: (v: string) => boolean): this {
        const copy = new (this.constructor as typeof Graph<GraphLabel, NodeLabel, EdgeLabel>)({
            directed: this._isDirected,
            multigraph: this._isMultigraph,
            compound: this._isCompound
        });

        copy.setGraph(this.graph()!);

        Object.entries(this._nodes).forEach(([v, value]) => {
            if (filter(v)) {
                copy.setNode(v, value);
            }
        });

        Object.values(this._edgeObjs).forEach((e) => {
            if (copy.hasNode(e.v) && copy.hasNode(e.w)) {
                copy.setEdge(e, this.edge(e));
            }
        });

        const parents: Record<string, string | undefined> = {};
        const findParent = (v: string): string | undefined => {
            const parent = this.parent(v);
            if (!parent || copy.hasNode(parent)) {
                parents[v] = parent ?? undefined;
                return parent ?? undefined;
            } else if (parent in parents) {
                return parents[parent];
            } else {
                return findParent(parent);
            }
        };

        if (this._isCompound) {
            copy.nodes().forEach(v => copy.setParent(v, findParent(v)));
        }

        return copy as this;
    }

    /**
     * Sets the default edge label. This label will be assigned as default label
     * in case if no label was specified while setting an edge.
     * Complexity: O(1).
     *
     * @param labelOrFn - default edge label or label factory function.
     * @returns the graph, allowing this to be chained with other functions.
     */
    setDefaultEdgeLabel(labelOrFn: EdgeLabel | EdgeLabelFactory<EdgeLabel>): this {
        if (typeof labelOrFn !== 'function') {
            this._defaultEdgeLabelFn = () => labelOrFn;
        } else {
            this._defaultEdgeLabelFn = labelOrFn as EdgeLabelFactory<EdgeLabel>;
        }

        return this;
    }

    /**
     * Gets the number of edges in the graph.
     * Complexity: O(1).
     *
     * @returns edges count.
     */
    edgeCount(): number {
        return this._edgeCount;
    }

    /**
     * Gets edges of the graph. In case of compound graph subgraphs are not considered.
     * Complexity: O(|E|).
     *
     * @returns graph edges list.
     */
    edges(): Edge[] {
        return Object.values(this._edgeObjs);
    }

    /* === Edge functions ========== */

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
    setPath(nodes: string[], label?: EdgeLabel): this {
        nodes.reduce((v, w) => {
            if (label !== undefined) {
                this.setEdge(v, w, label);
            } else {
                this.setEdge(v, w);
            }
            return w;
        });
        return this;
    }

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

    setEdge(v: string | Edge, w?: string | EdgeLabel, value?: EdgeLabel, name?: string): this {
        let vStr: string;
        let wStr: string;
        let nameStr: string | undefined;
        let edgeValue: EdgeLabel | undefined;
        let valueSpecified = false;

        if (typeof v === "object" && v !== null && "v" in v) {
            vStr = v.v;
            wStr = v.w;
            nameStr = v.name;
            if (arguments.length === 2) {
                edgeValue = w as EdgeLabel;
                valueSpecified = true;
            }
        } else {
            vStr = v;
            wStr = w as string;
            nameStr = name;
            if (arguments.length > 2) {
                edgeValue = value;
                valueSpecified = true;
            }
        }

        vStr = "" + vStr;
        wStr = "" + wStr;
        if (nameStr !== undefined) {
            nameStr = "" + nameStr;
        }

        const e = edgeArgsToId(this._isDirected, vStr, wStr, nameStr);
        if (e in this._edgeLabels) {
            if (valueSpecified) {
                this._edgeLabels[e] = edgeValue!;
            }
            return this;
        }

        if (nameStr !== undefined && !this._isMultigraph) {
            throw new Error("Cannot set a named edge when isMultigraph = false");
        }

        // It didn't exist, so we need to create it.
        // First ensure the nodes exist.
        this.setNode(vStr);
        this.setNode(wStr);

        this._edgeLabels[e] = valueSpecified ? edgeValue! : this._defaultEdgeLabelFn(vStr, wStr, nameStr);

        // Ensure we add undirected edges in a consistent way.
        const edgeObj = edgeArgsToObj(this._isDirected, vStr, wStr, nameStr);

        vStr = edgeObj.v;
        wStr = edgeObj.w;

        Object.freeze(edgeObj);
        this._edgeObjs[e] = edgeObj;
        incrementOrInitEntry(this._preds[wStr]!, vStr);
        incrementOrInitEntry(this._sucs[vStr]!, wStr);
        this._in[wStr]![e] = edgeObj;
        this._out[vStr]![e] = edgeObj;
        this._edgeCount++;
        return this;
    }

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

    edge(v: string | Edge, w?: string, name?: string): EdgeLabel {
        // TODO: This should return undefined if the edge doesn't exist, but that would be a breaking change.
        const e = (arguments.length === 1
            ? edgeObjToId(this._isDirected, v as Edge)
            : edgeArgsToId(this._isDirected, v as string, w!, name));
        return this._edgeLabels[e]!;
    }

    /**
     * Gets the label for the specified edge and converts it to an object.
     * Complexity: O(1).
     *
     * @param v - edge source node.
     * @param w - edge sink node.
     * @param name - name of the edge (actual for multigraph).
     * @returns value associated with specified edge.
     */
    edgeAsObj(v: string, w: string, name?: string): { label: EdgeLabel };

    /**
     * Gets the label for the specified edge and converts it to an object.
     * Complexity: O(1).
     *
     * @param edge - edge descriptor.
     * @returns value associated with specified edge.
     */
    edgeAsObj(edge: Edge): { label: EdgeLabel };

    edgeAsObj(v: string | Edge, w?: string, name?: string): { label: EdgeLabel } {
        const edgeLabel = arguments.length === 1
            ? this.edge(v as Edge)
            : this.edge(v as string, w!, name);

        if (typeof edgeLabel !== "object") {
            return {label: edgeLabel as EdgeLabel};
        }

        return edgeLabel as { label: EdgeLabel };
    }

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

    hasEdge(v: string | Edge, w?: string, name?: string): boolean {
        const e = (arguments.length === 1
            ? edgeObjToId(this._isDirected, v as Edge)
            : edgeArgsToId(this._isDirected, v as string, w!, name));
        return e in this._edgeLabels;
    }

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

    removeEdge(v: string | Edge, w?: string, name?: string): this {
        const e = (arguments.length === 1
            ? edgeObjToId(this._isDirected, v as Edge)
            : edgeArgsToId(this._isDirected, v as string, w!, name));
        const edge = this._edgeObjs[e];
        if (edge) {
            const vStr = edge.v;
            const wStr = edge.w;
            delete this._edgeLabels[e];
            delete this._edgeObjs[e];
            decrementOrRemoveEntry(this._preds[wStr]!, vStr);
            decrementOrRemoveEntry(this._sucs[vStr]!, wStr);
            delete this._in[wStr]![e];
            delete this._out[vStr]![e];
            this._edgeCount--;
        }
        return this;
    }

    /**
     * Return all edges that point to the node v. Optionally filters those edges down to just those
     * coming from node u. Behavior is void for undirected graphs - use nodeEdges instead.
     * Complexity: O(|E|).
     *
     * @param v - edge sink node.
     * @param w - edge source node.
     * @returns edges descriptors list if v is in the graph, or void otherwise.
     */
    inEdges(v: string, w?: string): void | Edge[] {
        if (this.isDirected()) {
            return this.filterEdges(this._in[v], v, w);
        }
        return this.nodeEdges(v, w);
    }

    /**
     * Return all edges that are pointed at by node v. Optionally filters those edges down to just
     * those point to w. Behavior is void for undirected graphs - use nodeEdges instead.
     * Complexity: O(|E|).
     *
     * @param v - edge source node.
     * @param w - edge sink node.
     * @returns edges descriptors list if v is in the graph, or void otherwise.
     */
    outEdges(v: string, w?: string): void | Edge[] {
        if (this.isDirected()) {
            return this.filterEdges(this._out[v], v, w);
        }
        return this.nodeEdges(v, w);
    }

    /**
     * Returns all edges to or from node v regardless of direction. Optionally filters those edges
     * down to just those between nodes v and w regardless of direction.
     * Complexity: O(|E|).
     *
     * @param v - edge adjacent node.
     * @param w - edge adjacent node.
     * @returns edges descriptors list if v is in the graph, or void otherwise.
     */
    nodeEdges(v: string, w?: string): void | Edge[] {
        if (v in this._nodes) {
            return this.filterEdges({...this._in[v]!, ...this._out[v]!}, v, w);
        }
    }

    // Defaults to be set when creating a new node
    private _defaultNodeLabelFn: NodeLabelFactory<NodeLabel> = () => undefined as NodeLabel;

    // Defaults to be set when creating a new edge
    private _defaultEdgeLabelFn: EdgeLabelFactory<EdgeLabel> = () => undefined as EdgeLabel;

    private _removeFromParentsChildList(v: string): void {
        delete this._children![this._parent![v]!]![v];
    }

    private filterEdges(setV: Record<string, Edge> | undefined, localEdge: string, remoteEdge?: string): Edge[] | undefined {
        if (!setV) {
            return;
        }
        const edges = Object.values(setV);
        if (!remoteEdge) {
            return edges;
        }
        return edges.filter((edge) => {
            return edge.v === localEdge && edge.w === remoteEdge
                || edge.v === remoteEdge && edge.w === localEdge;
        });
    }
}


function incrementOrInitEntry(map: Record<string, number>, k: string): void {
    if (map[k]) {
        map[k]++;
    } else {
        map[k] = 1;
    }
}

function decrementOrRemoveEntry(map: Record<string, number>, k: string): void {
    if (map[k] !== undefined && !--map[k]) {
        delete map[k];
    }
}

function edgeArgsToId(isDirected: boolean, v_: string, w_: string, name?: string): string {
    let v = "" + v_;
    let w = "" + w_;
    if (!isDirected && v > w) {
        const tmp = v;
        v = w;
        w = tmp;
    }
    return v + EDGE_KEY_DELIM + w + EDGE_KEY_DELIM +
        (name === undefined ? DEFAULT_EDGE_NAME : name);
}

function edgeArgsToObj(isDirected: boolean, v_: string, w_: string, name?: string): Edge {
    let v = "" + v_;
    let w = "" + w_;
    if (!isDirected && v > w) {
        const tmp = v;
        v = w;
        w = tmp;
    }
    const edgeObj: Edge = {v: v, w: w};
    if (name) {
        edgeObj.name = name;
    }
    return edgeObj;
}

function edgeObjToId(isDirected: boolean, edgeObj: Edge): string {
    return edgeArgsToId(isDirected, edgeObj.v, edgeObj.w, edgeObj.name);
}
