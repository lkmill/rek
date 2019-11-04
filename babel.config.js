'use strict'

module.exports = {
  env: {
    'node:cjs': {
      presets: [['@babel/env', { shippedProposals: true, targets: { node: 6 } }]],
      plugins: ['add-module-exports'],
    },

    'node:esm': {
      presets: [['@babel/env', { shippedProposals: true, targets: { node: 6 }, modules: false }]],
    },

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
