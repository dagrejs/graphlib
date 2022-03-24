# 进度
- [ ] 翻译 [API](https://github.com/dagrejs/graphlib/wiki/API-Reference) - 2022/03/23 21:06

> 中文 | [English](ReadMe.md)

[TOC]

# 介绍
`Graphlib`是一个JavaScript Lib库，为无向和有向多变图提供数据结构，以及可以一起使用的算法。

[![Build Status](https://secure.travis-ci.org/dagrejs/graphlib.svg)](http://travis-ci.org/dagrejs/graphlib)

更多学习内容, 查看[wiki](https://github.com/cpettitt/graphlib/wiki)。

# API 指南
本部分主要阐述graphlib的概念并提供API指南。默认情况下，graphlib函数和对象暴露在graphlib的命名空间下。

# 图像概念
Graphlib有一种图类型: Graph。
创建一个新的实例:
```js
var g = new Graph();
```
默认情况下，将会创建一个不允许多边或者复合节点的有向图。以下则是参数选项:
- `directed`:设置为`true`时, 得到一个有向图。`false`时, 得到一个无向图。无向图不会把节点的顺序视为第一要务。换句话说, 对无向图来说`g.edge("a", "b") === g.edge("b", "a")`。默认为`true`
- `multigraph`: 设置为`true`时, 允许图像在同一对节点之间有多条边。默认: `false`。
- `compound`: 设置为`true`时, 允许图像有复合节点。 可以是其他节点的父节点。 默认为`false`。

可以在constructor中通过对象配置属性。比如，创建一个有向复合多边图:
```js
var g = new Graph({ directed: true, compound: true, multigraph: true });
```

# 展现节点和边线
在graphlib中，节点由用户提供的字符串id表示。 所有节点相关的函数都使用此字符串id作为唯一标识节点的方式。以下为与节点交互的例子:
```js
var g = new Graph();
g.setNode("my-id", "my-label");

g.node("my-id"); // return "my-label"
```

graphlib中的边由他们连接的节点标识。比如:
```js
var g = new Graph();

g.setEdge("source", "target", "my-label");
g.edge("source", "target"); // return my-label
```

但是，为了进行各种类型的边缘查询，我们需要一种方法去唯一标识单个对象里的边。(比如：[outEdges](https://github.com/dagrejs/graphlib/wiki/API-Reference#outEdges))。我们使用`edgeObj`应对，而此主要由以下组成:
- `v`: 源id或者是边线上的尾节点。
- `w`: 目标id或者是边线上的头节点。
- `name`(可选):  唯一标识多边边线([multi-edge](https://github.com/dagrejs/graphlib/wiki/API-Reference#multigraphs))的名称。

任何采用了一个边线id的边缘函数也可以使用`edgeObj`：
```js
var g = new Graph();

g.setEdge("source", "target", "my-label")
g.edge({ v: "source", w: "target" }); // return my-label
```

# Multigraphs
multigraphs的数学概念: [multigraph](https://en.wikipedia.org/wiki/Multigraph)
<img src="./static/multigraph.jpg" width="300px" height="300px" />

多重图是一种在一对节点中可以拥有多条边的图。默认情况下, graphlib的图像不是多重图, 需要在构造体中设置多重图的属性为`true`:
```js
var g = new Graph({ multigraph: true })
```
在两个节点由多条边的情况下，我们需要相同的办法去识别每一条边。 我们称这样的属性为`name`。 这有关于相同节点之间的几条边的例子:
```js
var g = new Graph({ multigraph: true })

g.setEdge("a", "b", "edge1-label", "edge1")
g.setEdge("a", "b", "edge2-label", "edge2")

g.edge("a", "b", "edge1")
g.edge("a", "b", "edge2")

g.edges()
/**
 * return [
 *  { v: "a", w: "b", name: "edge1" },
 *  { v: "a", w: "b", name: "edge2" }
 * ]
 */
```

多重图也允许创建没有名字的一条边
```js
var g = new Graph({ multigraph: true })

g.setEdge("a", "b", "my-label")
g.edge({ v: "a", w: "b" })
```

# 复合图