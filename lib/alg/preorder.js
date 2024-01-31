import { default as dfs } from "./dfs.js";

export default function preorder(g, vs) {
  return dfs(g, vs, "pre");
}
