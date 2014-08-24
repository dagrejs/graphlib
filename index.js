/**
 * Copyright (c) 2014, Chris Pettitt
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 * list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *
 * 3. Neither the name of the copyright holder nor the names of its contributors
 * may be used to endorse or promote products derived from this software without
 * specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
module.exports = {
  Digraph: require("./lib/digraph"),
  CDigraph: require("./lib/compound-digraph"),

  Graph: require("./lib/graph"),
  CGraph: require("./lib/compound-graph"),

  alg: {
    components: require("./lib/alg/components"),
    dijkstra: require("./lib/alg/dijkstra"),
    dijkstraAll: require("./lib/alg/dijkstra-all"),
    findCycles: require("./lib/alg/find-cycles"),
    floydWarshall: require("./lib/alg/floyd-warshall"),
    isAcyclic: require("./lib/alg/is-acyclic"),
    postorder: require("./lib/alg/postorder"),
    preorder: require("./lib/alg/preorder"),
    prim: require("./lib/alg/prim"),
    tarjan: require("./lib/alg/tarjan"),
    topsort: require("./lib/alg/topsort")
  },

  util: require("./lib/util"),
  version: require("./lib/version")
};
