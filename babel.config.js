const { TEST } = process.env

const isTest = TEST === 'test'
const loose = true

module.exports = {
  ignore: [/node_modules\/(?!(lodash-es))/],
  presets: [
    [
      '@babel/preset-env',
      {
        loose,
        targets: isTest && {"node": "current"},
        modules: isTest ? "auto" : false,
        forceAllTransforms: true,
      },
    ],
  ],
  plugins: [
    "babel-plugin-annotate-pure-calls"
  ]
}