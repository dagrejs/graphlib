import * as path from 'path'
import nodeResolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import {uglify} from 'rollup-plugin-uglify'

const createConfig = ({ input, output, external, rewireLodash = false, min = false, useESModules = output.format !== 'cjs' }) => ({
  input,
  output,
  external,
  plugins: [
    nodeResolve({
      jsnext: true,
    }),
    babel({
      exclude: 'node_modules/**',
      babelrcRoots: path.resolve(__dirname, '../*'),
      plugins: [
          rewireLodash && ['babel-plugin-lodash', {id: 'lodash-es'}],
      ].filter(Boolean),
    //   runtimeHelpers: true,
    }),
    min &&
      uglify({
        compress: {
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true,
          warnings: false,
        },
      }),
  ].filter(Boolean),
})

export default [
  createConfig({
    rewireLodash: true,
    input: './index.js',
    output: {
      dir: 'build',
      format: 'umd',
      name: 'graphlib',
      file: 'graphlib.js'
    },
    min: false
  }),
  createConfig({
    rewireLodash: true,
    input: './index.js',
    output: {
      dir: 'build',
      format: 'umd',
      name: 'graphlib',
      file: 'graphlib.min.js'
    },
    min: true
  }),


  createConfig({
    input: './index.js',
    external: function(id) {
        return /lodash/.test(id)
    },
    output: {
      dir: 'build',
      format: 'umd',
      name: 'graphlib',
      file: 'graphlib.core.js',
      globals: {
        'lodash-es': '_'
      }
    },
    min: false
  }),
  createConfig({
    input: './index.js',
    external: function(id) {
        return /lodash/.test(id)
    },
    output: {
      dir: 'build',
      format: 'umd',
      name: 'graphlib',
      file: 'graphlib.core.min.js',
      globals: {
        'lodash-es': '_'
      }
    },
    min: true
  }),
]