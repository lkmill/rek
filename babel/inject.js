'use strict'

const { types: t } = require('@babel/core')

module.exports = function () {
  return {
    visitor: {
      Program: {
        enter: (path, _ref) => {
          if (_ref.file.opts.filename === 'src/factory.js') {
            const node = t.variableDeclaration('const', [
              t.variableDeclarator(t.identifier('fetch'), t.callExpression(t.identifier('require'), [
                t.stringLiteral('node-fetch'),
              ])),
            ])

            path.node.body.unshift(node)
          }
        },
      },
    },
  }
}
