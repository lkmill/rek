'use strict'

module.exports = {
  env: {
    cjs: {
      presets: [['@babel/env', { modules: 'commonjs', shippedProposals: true }]],
      plugins: [
        'add-module-exports',
        [
          'module-resolver',
          {
            resolvePath(sourcePath, currentFile, opts) {
              return sourcePath.endsWith('.mjs') ? sourcePath.slice(0, -4) : sourcePath
            },
          },
        ],
      ],
    },

    esm: {
      presets: [['@babel/env', { modules: false, shippedProposals: true }]],
    },

    umd: {
      presets: [['@babel/env', { modules: false, shippedProposals: true }]],
    },
  },
}
