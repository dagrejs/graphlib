// Type definitions for graphlib
// Project: https://github.com/cpettitt/graphlib
// Definitions by: Valentin Trinque <https://github.com/ValentinTrinque>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

/**
 * @fileOverview This file is a Typescript Definition File for graphlib.
 * @author Chris Pettitt <https://github.com/cpettitt>
 * @author Valentin Trinque <https://github.com/ValentinTrinque>
 * @version 1.0.5
 */

/**
 * @name graphlib
 * @namespace Hold the functionalities related to graphlib library.
 */
declare module Graphlib {

    var VERSION = '1.0.5-pre';

    interface GraphOptions {
        directed: boolean;
        compound: boolean;
        multigraph: boolean;
    }

    class Graph {
        constructor(opts?: GraphOptions);
        public isDirected(): boolean;
        public isMultigraph(): boolean;
        public isCompound(): boolean;
        public graph() : any;
        public setGraph(label: any): Graph;
        public nodeCount(): number;
        public edgeCount(): number;
        public setDefaultNodeLabel(newDefault: any): Graph;
        public setDefaultEdgeLabel(newDefault: any): Graph;
        public nodes(): Array<any>;
        public edges(): Array<any>;
        public sources(): Array<any>;
        public sinks(): Array<any>;
        public hasNodes(): boolean;
        public node(v: any): any;
        public setNode(v: any, value?: any): Graph;
        public removeNode(v: any): Graph;
        public predecessors(v: any): any;
        public successors(v: any): any;
        public neighbors(v: any): any;
        public inEdges(v: any, u: any): any;
        public outEdges(v: any, u: any): any;
        public nodeEdges(v: any, u: any): any;
        public parent(v: any): any;
        public children(v: any): any;
        public setParent(v: any, parent: any): Graph;
        public hasEdge(v: any, w: any, name?: any): boolean;
        public edge(v: any, w: any, name?: any): any;
        public setEdge(v: any, w: any, label?: any, name?: any): Graph;
        public removeEdge(v: any, w: any): Graph;
        public setPath(vs: any, value: any): Graph;
    }

    module Json {
        function write(g: Graph): any;
        function read(json: any) : Graph;
    }

    module Algorithms {
        function components(g: Graph): Array<any>;
        function djikstra(g: Graph, source: any, weightFn: any, edgeFn: any): any;
        function djikstraAll(g: Graph, weightFn: any, edgeFn: any): any;
        function findCycle(g: Graph): Array<any>;
        function floydWashall(g: Graph, weightFn: any, edgeFn: any): any;
        function isAcyclic(g: Graph): boolean;
        function postorder(g: Graph, vs: any): Array<any>;
        function preorder(g: Graph, vs: any): Array<any>;
        function prim(g: Graph, weightFn: any): any;
        function trajan(g: Graph): Array<Array<any>>;
        function topsort(g: Graph): Array<any>;
    }
}

declare module 'graphlib' {

    var toExport = {
        graph: Graphlib.Graph,
        json: Graphlib.Json,
        alg: Graphlib.Algorithms,
        version: Graphlib.VERSION
    }

    export = toExport;
}