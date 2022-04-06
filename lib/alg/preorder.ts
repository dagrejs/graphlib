import { Graph } from "../graph";
import { dfs } from "./dfs";

export function preorder(g: Graph, vs) {
  return dfs(g, vs, "pre");
}
