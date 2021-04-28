import type { Graph } from '..';
import { CycleException, topsort } from './topsort';

export function isAcyclic(g: Graph) {
  try {
    topsort(g);
  } catch (e) {
    if (e instanceof CycleException) {
      return false;
    }
    throw e;
  }
  return true;
}
