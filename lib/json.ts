import * as _  from "lodash";
import { Graph, GraphOptions } from "./graph";

interface JsonGraph {
  options: GraphOptions;
  nodes: JsonNode[];
  edges: JsonEdge[];
  value: string;
}

interface JsonNode {
  v: string;
  value: string;
  parent: string|void;
}

interface JsonEdge {
  v: string;
  w: string;
  name: string;
  value: string;
}

/**
 * Creates a JSON representation of the graph that can be serialized to a string with
 * JSON.stringify. The graph can later be restored using json.read.
 */
export function write(g: Graph): JsonGraph {
  var json: Partial<JsonGraph> = {
    options: {
      directed: g.isDirected(),
      multigraph: g.isMultigraph(),
      compound: g.isCompound()
    },
    nodes: writeNodes(g),
    edges: writeEdges(g)
  };
  if (!_.isUndefined(g.graph())) {
    json.value = _.clone(g.graph());
  }
  return json as JsonGraph;
}

function writeNodes(g: Graph): JsonNode[] {
  return _.map(g.nodes(), function(v) {
    var nodeValue = g.node(v);
    var parent = g.parent(v);
    var node: Partial<JsonNode> = { v: v };
    if (!_.isUndefined(nodeValue)) {
      node.value = nodeValue;
    }
    if (!_.isUndefined(parent)) {
      node.parent = parent;
    }
    return node;
  });
}

function writeEdges(g: Graph): JsonEdge[] {
  return _.map(g.edges(), function(e) {
    var edgeValue = g.edge(e);
    var edge: Partial<JsonEdge> = { v: e.v, w: e.w };
    if (!_.isUndefined(e.name)) {
      edge.name = e.name;
    }
    if (!_.isUndefined(edgeValue)) {
      edge.value = edgeValue;
    }
    return edge;
  });
}

/**
 * Takes JSON as input and returns the graph representation.
 *
 * @example
 * var g2 = graphlib.json.read(JSON.parse(str));
 * g2.nodes();
 * // ['a', 'b']
 * g2.edges()
 * // [ { v: 'a', w: 'b' } ]
 */
export function read(json: JsonGraph): Graph {
  var g = new Graph(json.options).setGraph(json.value);
  _.each(json.nodes, function(entry) {
    g.setNode(entry.v, entry.value);
    if (entry.parent) {
      g.setParent(entry.v, entry.parent);
    }
  });
  _.each(json.edges, function(entry) {
    g.setEdge({ v: entry.v, w: entry.w, name: entry.name }, entry.value);
  });
  return g;
}
