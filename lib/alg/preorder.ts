import { dfs } from "./dfs";
import { Graph } from "../graph";

export function preorder(g: Graph, vs) {
  return dfs(g, vs, "pre");
}
