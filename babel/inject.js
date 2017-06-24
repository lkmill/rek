'use strict'

module.exports = function ({ types: t }) {
  return {
    visitor: {
      Program: {
        enter: (path, _ref) => {
          const node = t.variableDeclaration('const', [
            t.variableDeclarator(t.identifier('fetch'), t.callExpression(t.identifier('require'), [
              t.stringLiteral('node-fetch')
            ]))
          ])

          path.node.body.unshift(node);
        },
      },
    },
  }
}


