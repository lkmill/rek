'use strict'

const { types: t } = require('@babel/core')

// check if destructuring from 'rek'
function variableDeclarationHasPattern (node) {
  for (const declar of node.declarations) {
    if (t.isPattern(declar.id) && declar.init.name === 'rek') {
      return true
    }
  }

  return false
}

module.exports = () => {
  return {
    visitor: {
      VariableDeclaration (path, state) {
        if (state.file.opts.filename === 'src/index.js' && variableDeclarationHasPattern(path.node)) {
          path.remove()
        }
      },

      ExportDeclaration (path) {
        if (path.type === 'ExportNamedDeclaration') {
          path.remove()
        }
      },
    },
  }
}
