import { Graph } from "../graph";

export function topsort(g: Graph) {
  var visited = {};
  var stack = {};
  var results: string[] = [];

  function visit(node) {
    if (stack.hasOwnProperty(node)) {
      throw new CycleException();
    }

    if (!visited.hasOwnProperty(node)) {
      stack[node] = true;
      visited[node] = true;
      g.predecessors(node)!.forEach(visit);
      delete stack[node];
      results.push(node);
    }
  }

  g.sinks().forEach(visit);

  if (Object.keys(visited).length !== g.nodeCount()) {
    throw new CycleException();
  }

  return results;
}

export class CycleException extends Error {}
