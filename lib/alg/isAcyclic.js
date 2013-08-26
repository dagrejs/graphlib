var topsort = require("./topsort");

module.exports = isAcyclic;

/*
 * Given a Graph **g** this function returns `true` if the graph has no cycles
 * and returns `false` if it does.
 *
 * @param {Graph} g the graph to test for cycles
 */
function isAcyclic(g) {
  try {
    topsort(g);
  } catch (e) {
    if (e instanceof topsort.CycleException) return false;
    throw e;
  }
  return true;
}
