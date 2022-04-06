import { dfs } from "./dfs";
import { Graph } from "../graph";

export function postorder(g: Graph, vs) {
  return dfs(g, vs, "post");
}
