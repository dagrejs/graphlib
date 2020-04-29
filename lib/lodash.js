// eslint-disable-next-line no-redeclare
/* global window */

var lodash;

if (typeof require === "function") {
  try {
    var _ = require("@snyk/lodash");
    lodash = {
      clone: _.clone,
      constant: _.constant,
      each: _.each,
      filter: _.filter,
      has:  _.has,
      isArray: _.isArray,
      isEmpty: _.isEmpty,
      isFunction: _.isFunction,
      isUndefined: _.isUndefined,
      keys: _.keys,
      map: _.map,
      reduce: _.reduce,
      size: _.size,
      transform: _.transform,
      union: _.union,
      values: _.values
    };
  } catch (e) {
    // continue regardless of error
  }
}

if (!lodash) {
  lodash = window._;
}

module.exports = lodash;
