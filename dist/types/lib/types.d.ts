/**
 * Options for creating a new Graph instance.
 */
export interface GraphOptions {
    /** Whether the graph edges have an orientation. Default: true */
    directed?: boolean;
    /** Whether the pair of nodes of the graph can have multiple edges. Default: false */
    multigraph?: boolean;
    /** Whether a node of the graph can have subnodes. Default: false */
    compound?: boolean;
}
/**
 * Represents an edge in the graph.
 */
export interface Edge {
    /** Source node identifier */
    v: string;
    /** Target node identifier */
    w: string;
    /** The name that uniquely identifies a multi-edge. */
    name?: string;
}
/**
 * Represents a path in the graph with distance and predecessor information.
 */
export interface Path {
    /** The sum of weights from source to this node along the shortest path */
    distance: number;
    /** The predecessor node in the shortest path, used to walk back to the source */
    predecessor: string;
}
/** Function that takes an edge and returns its weight */
export type WeightFunction = (e: Edge) => number;
/** Function that takes a node and returns the edges incident to it */
export type EdgeFunction = (v: string) => Edge[];
/** Factory function that creates a label for a node */
export type NodeLabelFactory<NodeLabel> = (v: string) => NodeLabel;
/** Factory function that creates a label for an edge */
export type EdgeLabelFactory<EdgeLabel> = (v: string, w: string, name?: string) => EdgeLabel;
//# sourceMappingURL=types.d.ts.map