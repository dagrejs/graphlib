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

# 展示节点和边线
