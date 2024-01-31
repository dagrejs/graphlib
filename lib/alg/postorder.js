import { default as dfs } from "./dfs.js";

export default function postorder(g, vs) {
  return dfs(g, vs, "post");
}
