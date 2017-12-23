'use strict'

const { types: t } = require('@babel/core')

module.exports = function () {
  return {
    visitor: {
      Program: {
        enter: (path, _ref) => {
          if (_ref.file.opts.filename === 'src/factory.js') {
            const nodes = [
              t.variableDeclaration('const', [
                t.variableDeclarator(t.identifier('fetch'), t.callExpression(t.identifier('require'), [
                  t.stringLiteral('node-fetch'),
                ])),
              ]),

              t.variableDeclaration('const', [
                t.variableDeclarator(t.identifier('Promise'), t.callExpression(t.identifier('require'), [
                  t.stringLiteral('bluebird'),
                ])),
              ]),

              t.expressionStatement(t.assignmentExpression(
                '=',
                t.memberExpression(t.identifier('fetch'), t.identifier('Promise')),
                t.identifier('Promise'),
              )),
            ]

            path.node.body.unshift(...nodes)
          }
        },
      },
    },
  }
}
