'use strict'

module.exports = function ({ types: t }) {
  return {
    visitor: {
      Program: {
        exit: function exit (path) {
          if (path.BABEL_PLUGIN_ADD_MODULE_EXPORTS) {
            return
          }

          let hasExportDefault = false

          path.get('body').forEach(function (path) {
            if (path.isExportDefaultDeclaration()) {
              hasExportDefault = true
              return
            }

            if (path.isExportNamedDeclaration()) {
              if (path.node.specifiers.length === 1 && path.node.specifiers[0].exported.name === 'default') {
                hasExportDefault = true
              }
            }
          })

          if (hasExportDefault) {
            path.pushContainer('body', [t.expressionStatement(t.assignmentExpression('=', t.memberExpression(t.identifier('module'), t.identifier('exports')), t.memberExpression(t.identifier('exports'), t.stringLiteral('default'), true)))])
          }

          path.BABEL_PLUGIN_ADD_MODULE_EXPORTS = true
        },
      },
    },
  }
}
// # sourceMappingURL=index.js.map
