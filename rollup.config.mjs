import { babel } from '@rollup/plugin-babel'
import nodeResolve from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import { uglify } from 'rollup-plugin-uglify'
import babelConfig from './babel.config.cjs'

export default [
  {
    input: 'src/native.js',
    plugins: [
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**/*',
      }),
      nodeResolve(),
    ],
    output: [
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
  },
  {
    input: 'src/native.js',
    plugins: [
      babel({
        ...babelConfig.env.umd,
        babelHelpers: 'bundled',
        exclude: 'node_modules/**/*',
      }),
      nodeResolve(),
    ],
    output: [
      {
        file: 'dist/rek.umd.js',
        sourcemap: true,
        format: 'umd',
        name: 'rek',
      },
      {
        file: 'dist/rek.umd.min.js',
        sourcemap: true,
        format: 'umd',
        name: 'rek',
        plugins: [uglify()],
      },
    ],
  },
  {
    input: 'src/native.js',
    plugins: [
      babel({
        ...babelConfig.env['umd:es5'],
        babelHelpers: 'bundled',
        exclude: 'node_modules/**/*',
      }),
      nodeResolve(),
    ],
    output: [
      {
        file: 'dist/rek.umd.es5.js',
        sourcemap: true,
        format: 'umd',
        name: 'rek',
      },
      {
        file: 'dist/rek.umd.es5.min.js',
        sourcemap: true,
        format: 'umd',
        name: 'rek',
        plugins: [uglify()],
      },
    ],
  },
]
