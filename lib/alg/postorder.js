import {dfs} from "./dfs"

export function postorder(g, vs) {
  return dfs(g, vs, "post");
}
