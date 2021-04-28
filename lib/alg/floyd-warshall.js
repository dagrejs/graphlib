const _ = require('../lodash');

module.exports = floydWarshall;

const DEFAULT_WEIGHT_FUNC = _.constant(1);

function floydWarshall(g, weightFn, edgeFn) {
  return runFloydWarshall(
    g,
    weightFn || DEFAULT_WEIGHT_FUNC,
    edgeFn ||
      function (v) {
        return g.outEdges(v);
      },
  );
}

function runFloydWarshall(g, weightFn, edgeFn) {
  const results = {};
  const nodes = g.nodes();

  nodes.forEach(function (v) {
    results[v] = {};
    results[v][v] = { distance: 0 };
    nodes.forEach(function (w) {
      if (v !== w) {
        results[v][w] = { distance: Number.POSITIVE_INFINITY };
      }
    });
    edgeFn(v).forEach(function (edge) {
      const w = edge.v === v ? edge.w : edge.v;
      const d = weightFn(edge);
      results[v][w] = { distance: d, predecessor: v };
    });
  });

  nodes.forEach(function (k) {
    const rowK = results[k];
    nodes.forEach(function (i) {
      const rowI = results[i];
      nodes.forEach(function (j) {
        const ik = rowI[k];
        const kj = rowK[j];
        const ij = rowI[j];
        const altDistance = ik.distance + kj.distance;
        if (altDistance < ij.distance) {
          ij.distance = altDistance;
          ij.predecessor = kj.predecessor;
        }
      });
    });
  });

  return results;
}
