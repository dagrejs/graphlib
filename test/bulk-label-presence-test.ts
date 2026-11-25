import {Graph} from '../lib/graph.js';

describe('explicitly undefined labels in bulk setters', () => {
    test('clears existing node labels like setNode does', () => {
        const graph = new Graph().setNodes(['a', 'b'], 'old');
        expect(graph.setNodes(['a', 'b'], undefined)).toBe(graph);
        expect(graph.node('a')).toBeUndefined();
        expect(graph.node('b')).toBeUndefined();
    });

    test('does not call a node default when undefined was supplied', () => {
        const factory = jest.fn(() => 'default');
        const graph = new Graph().setDefaultNodeLabel(factory);
        graph.setNodes(['a', 'b'], undefined);
        expect(graph.nodes()).toEqual(['a', 'b']);
        expect(graph.node('a')).toBeUndefined();
        expect(graph.node('b')).toBeUndefined();
        expect(factory).not.toHaveBeenCalled();
    });

    test('keeps node defaults and existing labels when the label is omitted', () => {
        const graph = new Graph().setDefaultNodeLabel(v => `default-${v}`).setNode('a', 'old');
        graph.setNodes(['a', 'b']);
        expect(graph.node('a')).toBe('old');
        expect(graph.node('b')).toBe('default-b');
    });

    test('clears existing path labels like setEdge does', () => {
        const graph = new Graph().setPath(['a', 'b', 'c'], 'old');
        expect(graph.setPath(['a', 'b', 'c'], undefined)).toBe(graph);
        expect(graph.edge('a', 'b')).toBeUndefined();
        expect(graph.edge('b', 'c')).toBeUndefined();
    });

    test('does not call an edge default when undefined was supplied', () => {
        const factory = jest.fn(() => 'default');
        const graph = new Graph().setDefaultEdgeLabel(factory);
        graph.setPath(['a', 'b', 'c'], undefined);
        expect(graph.edgeCount()).toBe(2);
        expect(graph.edge('a', 'b')).toBeUndefined();
        expect(graph.edge('b', 'c')).toBeUndefined();
        expect(factory).not.toHaveBeenCalled();
    });

    test('keeps edge defaults and existing labels when the label is omitted', () => {
        const graph = new Graph().setDefaultEdgeLabel('default').setEdge('a', 'b', 'old');
        graph.setPath(['a', 'b', 'c']);
        expect(graph.edge('a', 'b')).toBe('old');
        expect(graph.edge('b', 'c')).toBe('default');
    });
});
