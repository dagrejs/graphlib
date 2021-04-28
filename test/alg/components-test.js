const expect = require('../chai').expect;
const _ = require('@snyk/lodash');
const Graph = require('../..').Graph;
const components = require('../..').alg.components;

describe('alg.components', function () {
  it('returns an empty list for an empty graph', function () {
    expect(components(new Graph({ directed: false }))).to.be.empty;
  });

  it('returns singleton lists for unconnected nodes', function () {
    const g = new Graph({ directed: false });
    g.setNode('a');
    g.setNode('b');

    const result = _.sortBy(components(g), function (arr) {
      return _.min(arr);
    });
    expect(result).to.eql([['a'], ['b']]);
  });

  it('returns a list of nodes in a component', function () {
    const g = new Graph({ directed: false });
    g.setEdge('a', 'b');
    g.setEdge('b', 'c');

    const result = _.map(components(g), function (xs) {
      return _.sortBy(xs);
    });
    expect(result).to.eql([['a', 'b', 'c']]);
  });

  it('returns nodes connected by a neighbor relationship in a digraph', function () {
    const g = new Graph();
    g.setPath(['a', 'b', 'c', 'a']);
    g.setEdge('d', 'c');
    g.setEdge('e', 'f');

    const result = _.sortBy(
      _.map(components(g), function (xs) {
        return _.sortBy(xs);
      }),
      '0',
    );
    expect(result).to.eql([
      ['a', 'b', 'c', 'd'],
      ['e', 'f'],
    ]);
  });
});
