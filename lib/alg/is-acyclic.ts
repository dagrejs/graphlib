import { Graph } from "../graph";
import { topsort, CycleException } from "./topsort";

export function isAcyclic(g?: Graph) {
  try {
    topsort(g as Graph);
  } catch (e) {
    if (e instanceof CycleException) {
      return false;
    }
    throw e;
  }
  return true;
}
