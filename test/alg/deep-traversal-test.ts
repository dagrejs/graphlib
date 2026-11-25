import {Graph} from '../../lib/graph.js';
import {preorder} from '../../lib/alg/preorder.js';
import {postorder} from '../../lib/alg/postorder.js';
import {reduce} from '../../lib/alg/reduce.js';

describe.each([true, false])('deep traversal with directed=%s', directed => {
    test.each(['pre', 'post'] as const)('%s-order traverses a 20,000-node path', order => {
        const nodes = Array.from({length: 20000}, (_, i) => `node-${i}`);
        const graph = new Graph({directed}).setPath(nodes);
        const traverse = order === 'pre' ? preorder : postorder;
        const expected = order === 'pre' ? nodes : [...nodes].reverse();

        expect(traverse(graph, [nodes[0]!, nodes[10000]!])).toEqual(expected);
    });
});

test('keeps traversal order across cycles, shared descendants and multiple roots', () => {
    const graph = new Graph().setPath(['a', 'b', 'd']).setEdge('a', 'c').setEdge('c', 'd')
        .setEdge('d', 'a').setNode('isolated');

    expect(preorder(graph, ['a', 'c', 'isolated'])).toEqual(['a', 'b', 'd', 'c', 'isolated']);
    expect(postorder(graph, ['a', 'c', 'isolated'])).toEqual(['d', 'b', 'c', 'a', 'isolated']);
});

test('retains reducer results on a deep path', () => {
    const nodes = Array.from({length: 20000}, (_, i) => `node-${i}`);
    const graph = new Graph().setPath(nodes);
    expect(reduce(graph, nodes[0]!, 'post', count => count + 1, 0)).toBe(nodes.length);
});
