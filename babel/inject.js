'use strict'

const { types: t } = require('@babel/core')

module.exports = function () {
  return {
    visitor: {
      Program: {
        enter: (path, _ref) => {
          if (_ref.file.opts.filename.endsWith('src/factory.mjs')) {
            console.log('doing stuff')
            const node = t.importDeclaration([
              t.importDefaultSpecifier(t.identifier('fetch')),
              t.importSpecifier(t.identifier('Headers'), t.identifier('Headers')),
            ], t.stringLiteral('node-fetch'))

            path.node.body.unshift(node)
          }
        },
      },
    },
  }
}
