import * as _ from './lodash';
import { Graph } from './graph';

export type Json = Record<string, any>;

export function write(g: Graph): Json {
  const json: Json = {
    options: {
      directed: g.isDirected(),
      multigraph: g.isMultigraph(),
      compound: g.isCompound(),
    },
    nodes: writeNodes(g),
    edges: writeEdges(g),
  };
  if (undefined !== g.graph()) {
    json.value = _.clone(g.graph());
  }
  return json;
}

function writeNodes(g: Graph) {
  return _.map(g.nodes(), function (v) {
    const nodeValue = g.node(v);
    const parent = g.parent(v);
    const node: Json = { v: v };
    if (undefined !== nodeValue) {
      node.value = nodeValue;
    }
    if (undefined !== parent) {
      node.parent = parent;
    }
    return node;
  });
}

function writeEdges(g: Graph): Json {
  return _.map(g.edges(), function (e) {
    const edgeValue = g.edge(e);
    const edge: Json = { v: e.v, w: e.w };
    if (undefined !== e.name) {
      edge.name = e.name;
    }
    if (undefined !== edgeValue) {
      edge.value = edgeValue;
    }
    return edge;
  });
}

export function read(json: Record<string, any>): Graph {
  const g = new Graph(json.options).setGraph(json.value);
  _.each(json.nodes, function (entry) {
    g.setNode(entry.v, entry.value);
    if (entry.parent) {
      g.setParent(entry.v, entry.parent);
    }
  });
  _.each(json.edges, function (entry) {
    g.setEdge({ v: entry.v, w: entry.w, name: entry.name }, entry.value);
  });
  return g;
}
