// eslint-disable-next-line no-redeclare
/* global window */

var lodash;

if (typeof require === "function") {
  try {
    lodash = {
      clone: require("lodash.clone"),
      constant: require("lodash.constant"),
      each: require("lodash.foreach"),
      filter: require("lodash.filter"),
      has: require("lodash.has"),
      isArray: Array.isArray,
      isEmpty: require("lodash.isempty"),
      isFunction: require("lodash.isfunction"),
      isUndefined: require("lodash.isundefined"),
      keys: require("lodash.keys"),
      map: require("lodash.map"),
      reduce: require("lodash.reduce"),
      size: require("lodash.size"),
      transform: require("lodash.transform"),
      union: require("lodash.union"),
      values: require("lodash.values")
    };
  } catch (e) {
    // continue regardless of error
  }
}

if (!lodash) {
  lodash = window._;
}

module.exports = lodash;
