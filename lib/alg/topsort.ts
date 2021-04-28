import * as _ from '../lodash';
import type { Graph } from '..';

export function topsort(g: Graph): string[] {
  const visited = {};
  const stack = {};
  const results: any[] = [];

  function visit(node) {
    if (_.has(stack, node)) {
      throw new CycleException();
    }

    if (!_.has(visited, node)) {
      stack[node] = true;
      visited[node] = true;
      _.each(g.predecessors(node), visit);
      delete stack[node];
      results.push(node);
    }
  }

  _.each(g.sinks(), visit);

  if (_.size(visited) !== g.nodeCount()) {
    throw new CycleException();
  }

  return results;
}

export class CycleException extends Error {}
