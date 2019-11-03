import babel from 'rollup-plugin-babel'
import nodeResolve from 'rollup-plugin-node-resolve'

export default {
  plugins: [
    babel({
      exclude: 'node_modules/**/*',
    }),
    nodeResolve({
      mainFields: [ 'module', 'browser', 'main' ],
    }),
  ],
  input: 'src/browser.mjs',
  output: {
    format: 'umd',
    name: 'rek',
  },
}
