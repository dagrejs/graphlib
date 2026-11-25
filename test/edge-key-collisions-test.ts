import {Graph} from '../lib/graph.js';
import * as json from '../lib/json.js';

describe.each([true, false])('edge identity with directed=%s', directed => {
    test('keeps separators inside endpoint IDs distinct from field boundaries', () => {
        const graph = new Graph({directed, multigraph: true});
        graph.setEdge('a\x01b', 'c', 'first', 'edge');
        graph.setEdge('a', 'b\x01c', 'second', 'edge');

        expect(graph.nodeCount()).toBe(4);
        expect(graph.edgeCount()).toBe(2);
        expect(graph.edge('a\x01b', 'c', 'edge')).toBe('first');
        expect(graph.edge('a', 'b\x01c', 'edge')).toBe('second');
        graph.removeEdge('a\x01b', 'c', 'edge');
        expect(graph.edgeCount()).toBe(1);
        expect(graph.hasEdge('a\x01b', 'c', 'edge')).toBe(false);
        expect(graph.nodeEdges('a\x01b')).toEqual([]);
        expect(graph.edge('a', 'b\x01c', 'edge')).toBe('second');
    });

    test('separates the destination from a name containing a separator', () => {
        const graph = new Graph({directed, multigraph: true});
        graph.setEdge('a', 'b\x01c', 'first', 'd');
        graph.setEdge('a', 'b', 'second', 'c\x01d');

        expect(graph.edgeCount()).toBe(2);
        expect(graph.edge('a', 'b\x01c', 'd')).toBe('first');
        expect(graph.edge('a', 'b', 'c\x01d')).toBe('second');
        expect(graph.nodeEdges('a')).toHaveLength(2);
    });

    test('keeps an explicit NUL name separate from an unnamed edge', () => {
        const graph = new Graph({directed, multigraph: true});
        graph.setEdge('a', 'b', 'unnamed');
        graph.setEdge('a', 'b', 'named', '\x00');

        expect(graph.edgeCount()).toBe(2);
        expect(graph.edge('a', 'b')).toBe('unnamed');
        expect(graph.edge({v: 'a', w: 'b', name: '\x00'})).toBe('named');
        graph.removeEdge('a', 'b');
        expect(graph.edgeCount()).toBe(1);
        expect(graph.edges()).toEqual([{v: 'a', w: 'b', name: '\x00'}]);
    });

    test('preserves edge identities through filtering and JSON round trips', () => {
        const graph = new Graph({directed, multigraph: true});
        graph.setEdge('a\x01b', 'c', 'first', 'edge');
        graph.setEdge('a', 'b\x01c', 'second', 'edge');
        const restored = json.read(JSON.parse(JSON.stringify(json.write(graph.filterNodes(() => true)))));
        expect(restored.edgeCount()).toBe(2);
        expect(restored.edge('a\x01b', 'c', 'edge')).toBe('first');
        expect(restored.edge('a', 'b\x01c', 'edge')).toBe('second');
    });
});
