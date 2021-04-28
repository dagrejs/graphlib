import { Graph } from '..';
import * as _ from '../lodash';
import { dijkstra } from './dijkstra';

export function dijkstraAll(g: Graph, weightFunc?, edgeFunc?) {
  return _.transform(
    g.nodes(),
    function (acc, v) {
      acc[v] = dijkstra(g, v, weightFunc, edgeFunc);
    },
    {},
  );
}
