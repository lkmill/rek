import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: {
    rek: './src/index.js',
  },
  format: 'esm',
  minify: true,
})
