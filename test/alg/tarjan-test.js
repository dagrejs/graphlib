const _ = require('@snyk/lodash');
const expect = require('../chai').expect;
const Graph = require('../..').Graph;
const tarjan = require('../..').alg.tarjan;

describe('alg.tarjan', function () {
  it('returns an empty array for an empty graph', function () {
    expect(tarjan(new Graph())).to.eql([]);
  });

  it('returns singletons for nodes not in a strongly connected component', function () {
    const g = new Graph();
    g.setPath(['a', 'b', 'c']);
    g.setEdge('d', 'c');
    expect(sort(tarjan(g))).to.eql([['a'], ['b'], ['c'], ['d']]);
  });

  it('returns a single component for a cycle of 1 edge', function () {
    const g = new Graph();
    g.setPath(['a', 'b', 'a']);
    expect(sort(tarjan(g))).to.eql([['a', 'b']]);
  });

  it('returns a single component for a triangle', function () {
    const g = new Graph();
    g.setPath(['a', 'b', 'c', 'a']);
    expect(sort(tarjan(g))).to.eql([['a', 'b', 'c']]);
  });

  it('can find multiple components', function () {
    const g = new Graph();
    g.setPath(['a', 'b', 'a']);
    g.setPath(['c', 'd', 'e', 'c']);
    g.setNode('f');
    expect(sort(tarjan(g))).to.eql([['a', 'b'], ['c', 'd', 'e'], ['f']]);
  });
});

// A helper that sorts components and their contents
function sort(cmpts) {
  return _.sortBy(
    _.map(cmpts, function (cmpt) {
      return _.sortBy(cmpt);
    }),
    function (cmpts) {
      return cmpts[0];
    },
  );
}
