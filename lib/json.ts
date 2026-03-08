import {Graph} from './graph';
import type {GraphOptions} from './types';

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
export function write(graph: Graph): JsonGraph {
    const json: JsonGraph = {
        options: {
            directed: graph.isDirected(),
            multigraph: graph.isMultigraph(),
            compound: graph.isCompound()
        },
        nodes: writeNodes(graph),
        edges: writeEdges(graph)
    };

    const graphLabel = graph.graph();
    if (graphLabel !== undefined) {
        json.value = structuredClone(graphLabel);
    }

    return json;
}

function writeNodes(g: Graph): JsonNode[] {
    return g.nodes().map(v => {
        const nodeValue = g.node(v);
        const parent = g.parent(v);
        const node: JsonNode = {v};

        if (nodeValue !== undefined) {
            node.value = nodeValue;
        }
        if (parent !== undefined) {
            node.parent = parent;
        }

        return node;
    });
}

function writeEdges(g: Graph): JsonEdge[] {
    return g.edges().map(e => {
        const edgeValue = g.edge(e);
        const edge: JsonEdge = {v: e.v, w: e.w};

        if (e.name !== undefined) {
            edge.name = e.name;
        }
        if (edgeValue !== undefined) {
            edge.value = edgeValue;
        }

        return edge;
    });
}

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
export function read<GraphLabel = any, NodeLabel = any, EdgeLabel = any>(
    json: JsonGraph
): Graph<GraphLabel, NodeLabel, EdgeLabel> {
    const g = new Graph<GraphLabel, NodeLabel, EdgeLabel>(json.options);

    if (json.value !== undefined) {
        g.setGraph(json.value as GraphLabel);
    }

    json.nodes.forEach(entry => {
        g.setNode(entry.v, entry.value as NodeLabel);
        if (entry.parent) {
            g.setParent(entry.v, entry.parent);
        }
    });

    json.edges.forEach(entry => {
        g.setEdge({v: entry.v, w: entry.w, name: entry.name}, entry.value as EdgeLabel);
    });

    return g;
}
