import { Graph } from '..';
import { dfs } from './dfs';

export function preorder(g: Graph, vs: string[]) {
  return dfs(g, vs, 'pre');
}
