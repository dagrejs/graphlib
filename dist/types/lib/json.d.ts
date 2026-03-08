import { Graph } from './graph';
import type { GraphOptions } from './types';
interface JsonGraph {
    options: GraphOptions;
    nodes: JsonNode[];
    edges: JsonEdge[];
    value?: unknown;
}
interface JsonNode {
    v: string;
    value?: unknown;
    parent?: string;
}
interface JsonEdge {
    v: string;
    w: string;
    name?: string;
    value?: unknown;
}
/**
 * Creates a JSON representation of the graph that can be serialized to a string with
 * JSON.stringify. The graph can later be restored using json.read.
 *
 * @param graph - target to create JSON representation of.
 * @returns JSON serializable graph representation
 */
export declare function write(graph: Graph): JsonGraph;
/**
 * Takes JSON as input and returns the graph representation.
 *
 * @param json - JSON serializable graph representation
 * @returns graph constructed according to specified representation
 *
 * @example
 * var g2 = graphlib.json.read(JSON.parse(str));
 * g2.nodes();
 * // ['a', 'b']
 * g2.edges()
 * // [ { v: 'a', w: 'b' } ]
 */
export declare function read<GraphLabel = any, NodeLabel = any, EdgeLabel = any>(json: JsonGraph): Graph<GraphLabel, NodeLabel, EdgeLabel>;
export {};
//# sourceMappingURL=json.d.ts.map