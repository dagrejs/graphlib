const { merge } = require('webpack-merge');
const common = require('./webpack.config.js');

module.exports = merge(common, {
  output: {
    filename: 'graphlib.min.js'
  }
});
