import {Graph} from '../lib/graph.js';

describe('setPath with no edges', () => {
    test('accepts an empty path without creating nodes or calling label factories', () => {
        const nodeLabel = jest.fn(() => 'node');
        const edgeLabel = jest.fn(() => 'edge');
        const graph = new Graph().setDefaultNodeLabel(nodeLabel).setDefaultEdgeLabel(edgeLabel);

        expect(graph.setPath([])).toBe(graph);
        expect(graph.nodes()).toEqual([]);
        expect(graph.edges()).toEqual([]);
        expect(nodeLabel).not.toHaveBeenCalled();
        expect(edgeLabel).not.toHaveBeenCalled();
    });

    test('leaves an existing graph unchanged when an empty path has a label', () => {
        const graph = new Graph().setEdge('a', 'b', 'original');

        expect(graph.setPath([], 'replacement')).toBe(graph);
        expect(graph.nodes()).toEqual(['a', 'b']);
        expect(graph.edges()).toEqual([{v: 'a', w: 'b'}]);
        expect(graph.edge('a', 'b')).toBe('original');
    });

    test('retains the existing no-edge behavior of a singleton path', () => {
        const graph = new Graph();
        expect(graph.setPath(['a'])).toBe(graph);
        expect(graph.nodeCount()).toBe(0);
        expect(graph.edgeCount()).toBe(0);
    });
});
