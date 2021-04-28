import type { Graph } from '..';
import { dfs } from './dfs';

export function postorder(g: Graph, vs: string[]): string[] {
  return dfs(g, vs, 'post');
}
