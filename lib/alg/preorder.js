import {dfs} from "./dfs"

export function preorder(g, vs) {
  return dfs(g, vs, "pre");
}
