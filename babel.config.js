'use strict'

module.exports = {
  env: {
    cjs: {
      presets: [['@babel/env', { modules: 'commonjs', shippedProposals: true }]],
      plugins: ['add-module-exports'],
    },

    esm: {
      presets: [['@babel/env', { modules: false, shippedProposals: true }]],
    },

    umd: {
      presets: [['@babel/env', { modules: false, shippedProposals: true }]],
    },
  },
}
