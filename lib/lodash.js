// eslint-disable-next-line no-redeclare
/* global window */

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var lodash;

if (typeof require === "function") {
  try {
    lodash = {
      clone: _interopDefault(require("lodash/clone")),
      constant: _interopDefault(require("lodash/constant")),
      each: _interopDefault(require("lodash/each")),
      filter: _interopDefault(require("lodash/filter")),
      has:  _interopDefault(require("lodash/has")),
      isArray: _interopDefault(require("lodash/isArray")),
      isEmpty: _interopDefault(require("lodash/isEmpty")),
      isFunction: _interopDefault(require("lodash/isFunction")),
      isUndefined: _interopDefault(require("lodash/isUndefined")),
      keys: _interopDefault(require("lodash/keys")),
      map: _interopDefault(require("lodash/map")),
      reduce: _interopDefault(require("lodash/reduce")),
      size: _interopDefault(require("lodash/size")),
      transform: _interopDefault(require("lodash/transform")),
      union: _interopDefault(require("lodash/union")),
      values: _interopDefault(require("lodash/values"))
    };
  } catch (e) {
    // continue regardless of error
  }
}

if (!lodash) {
  lodash = window._;
}

module.exports = lodash;
