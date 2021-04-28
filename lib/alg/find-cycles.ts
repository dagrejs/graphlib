import { Graph } from '..';
import * as _ from '../lodash';
import { tarjan } from './tarjan';

export function findCycles(g: Graph) {
  return _.filter(tarjan(g), function (cmpt) {
    return (
      cmpt.length > 1 || (cmpt.length === 1 && g.hasEdge(cmpt[0], cmpt[0]))
    );
  });
}
