'use strict'

module.exports = () => {
  return {
    visitor: {
      ExportDeclaration (path) {
        if (path.type === 'ExportNamedDeclaration') {
          path.remove()
        }
      },
    },
  }
}
