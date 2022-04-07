import { Graph } from "../graph";
import { dfs } from "./dfs";

export function postorder(g: Graph, vs) {
  return dfs(g, vs, "post");
}
