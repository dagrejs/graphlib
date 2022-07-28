import { Graph} from "../graph";
import { dijkstra } from "./dijkstra";

export function dijkstraAll(g: Graph, weightFunc?, edgeFunc?) {
  return g.nodes().reduce(function(acc, v) {
    acc[v] = dijkstra(g, v, weightFunc, edgeFunc);
    return acc;
  }, {});
}
