exports.copy = function(obj) {
  var ks = Object.keys(obj),
      length = ks.length,
      result = {};

  for (var i = 0; i < length; ++i) {
    var k = ks[i];
    result[k] = obj[k];
  }

  return result;
};

exports.values = function(obj) {
  var ks = Object.keys(obj),
      length = ks.length,
      result = new Array(length);

  for (var i = 0; i < length; ++i) {
    result[i] = obj[ks[i]];
  }

  return result;
};
