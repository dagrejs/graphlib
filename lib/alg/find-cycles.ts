import { Graph } from "../graph";
import { tarjan } from "./tarjan";

export function findCycles(g: Graph) {
  return tarjan(g).filter(function(cmpt) {
    return cmpt.length > 1 || (cmpt.length === 1 && g.hasEdge(cmpt[0], cmpt[0]));
  });
}
