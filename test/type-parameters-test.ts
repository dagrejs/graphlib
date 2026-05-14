import {Graph} from "../lib";
import {read, write} from '../lib/json';

it("Graph type parameters work as expected", () => {
    type StringRecord<Key extends string> = Record<Key, string>;
    class GraphBaseLabel implements StringRecord<"graph"> {
        readonly graph: string;
        constructor(graphLabel: string) {
            this.graph = graphLabel;
        }
    }

    class NodeBaseLabel implements StringRecord<"node"> {
        readonly node: string;
        constructor(nodeLabel: string) {
            this.node = nodeLabel;
        }
    }

    class EdgeBaseLabel implements StringRecord<"edge"> {
        readonly edge: string;
        constructor(edgeLabel: string) {
            this.edge = edgeLabel;
        }
    }

    const g: Graph<StringRecord<"graph">, StringRecord<"node">, StringRecord<"edge">> = new Graph();

    const graphLabel = new GraphBaseLabel("foo");
    g.setGraph(graphLabel);
    expect(g.graph()).toBe(graphLabel);

    const firstNodeLabel = new NodeBaseLabel("firstNode");
    const secondNodeLabel = new NodeBaseLabel("secondNode");
    const thirdNodeLabel = new NodeBaseLabel("thirdNode");
    const fourthNodeLabel = new NodeBaseLabel("fourthNode");

    g.setNode("first", firstNodeLabel);
    g.setNode("second", secondNodeLabel);
    g.setNode("third", thirdNodeLabel);
    g.setNode("fourth", fourthNodeLabel);

    expect(g.node("first")).toBe(firstNodeLabel);
    expect(g.node("second")).toBe(secondNodeLabel);
    expect(g.node("third")).toBe(thirdNodeLabel);
    expect(g.node("fourth")).toBe(fourthNodeLabel);
    expect(g.node("fifth")).toBeUndefined();

    const firstToSecond = new EdgeBaseLabel("first to second");
    const secondToThird = new EdgeBaseLabel("second to third");
    const thirdToFirst = new EdgeBaseLabel("third to first");
    const firstToFourth = new EdgeBaseLabel("first to fourth");

    g.setEdge("first", "second", firstToSecond);
    g.setEdge("second", "third", secondToThird);
    g.setEdge("third", "first", thirdToFirst);
    g.setEdge("first", "fourth", firstToFourth);

    expect(g.edge("first", "second")).toBe(firstToSecond);
    expect(g.edge("second", "third")).toBe(secondToThird);
    expect(g.edge("third", "first")).toBe(thirdToFirst);
    expect(g.edge("first", "fourth")).toBe(firstToFourth);
    expect(g.edge("fourth", "third")).toBeUndefined();

    const g2 = read<StringRecord<"graph">, StringRecord<"node">, StringRecord<"edge">>(write(g));
    expect(g2.node("first")).toEqual(firstNodeLabel);
    expect(g2.node("second")).toEqual(secondNodeLabel);
    expect(g2.node("third")).toEqual(thirdNodeLabel);
    expect(g2.node("fourth")).toEqual(fourthNodeLabel);
    expect(g2.node("fifth")).toBeUndefined();
    expect(g2.edge("first", "second")).toEqual(firstToSecond);
    expect(g2.edge("second", "third")).toEqual(secondToThird);
    expect(g2.edge("third", "first")).toEqual(thirdToFirst);
    expect(g2.edge("first", "fourth")).toEqual(firstToFourth);
    expect(g2.edge("fourth", "third")).toBeUndefined();
});
