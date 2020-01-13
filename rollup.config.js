import babel from 'rollup-plugin-babel'
import nodeResolve from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import { uglify } from 'rollup-plugin-uglify'

export default {
  plugins: [
    babel({
      exclude: 'node_modules/**/*',
    }),
    nodeResolve({
      mainFields: ['module', 'browser', 'main'],
    }),
  ],
  input: 'src/browser.mjs',
  output: [
    {
      file: 'dist/rek.js',
      sourcemap: true,
      format: 'umd',
      name: 'rek',
    },
    {
      file: 'dist/rek.min.js',
      sourcemap: true,
      format: 'umd',
      name: 'rek',
      plugins: [uglify()],
    },
    {
      file: 'dist/rek.esm.js',
      sourcemap: true,
      format: 'esm',
    },
    {
      file: 'dist/rek.esm.min.js',
      sourcemap: true,
      format: 'esm',
      plugins: [terser()],
    },
  ],
}
