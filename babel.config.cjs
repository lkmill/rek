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
              return sourcePath.endsWith('.js') ? sourcePath.slice(0, -2) + 'cjs' : sourcePath
            },
          },
        ],
      ],
    },

    esm: {
      presets: [['@babel/env', { modules: false, shippedProposals: true }]],
    },
  },
}
