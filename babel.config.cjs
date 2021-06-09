const { parse } = require('@babel/parser')
const { resolve } = require('path')

const presetEnvConfig = {
  targets: { chrome: 79, edge: 16, firefox: 60, opera: 48, safari: '10.1' },
  modules: false,
  shippedProposals: true,
}

const entryFiles = ['./src/browser.js', './src/node.js'].map((file) => resolve(file))
const cjsFiles = ['./error.js', './factory.js']

function removeNamedExports() {
  return {
    visitor: {
      ImportDeclaration(path, _ref) {
        if (!entryFiles.includes(_ref.file.opts.filename)) return

        if (path.node.source.value === './error.cjs') path.remove()
      },
      ExportNamedDeclaration(path) {
        path.remove()
      },
    },
  }
}

function simpleClassTransform() {
  return {
    visitor: {
      ClassDeclaration(path) {
        if (path.node.id?.name !== 'FetchError') return

        const ast = parse(`
function FetchError(response, body) {
  this.name = 'FetchError'
  this.message = response.statusText
  this.status = response.status
  this.body = body
  this.response = response
  this.stack = new Error().stack
}

FetchError.prototype = Object.create(Error.prototype)
FetchError.prototype.constructor = FetchError
`)

        path.replaceWith(ast.program.body[0])
      },
    },
  }
}

module.exports = {
  presets: [['@babel/env', presetEnvConfig]],
  env: {
    cjs: {
      plugins: [
        removeNamedExports,
        'babel-plugin-transform-es2015-modules-simple-commonjs',
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
      plugins: [
        [
          'module-resolver',
          {
            resolvePath(sourcePath, currentFile, opts) {
              return cjsFiles.includes(sourcePath) ? sourcePath.slice(0, -2) + 'cjs' : sourcePath
            },
          },
        ],
      ],
    },
    umd: {
      plugins: [removeNamedExports],
    },

    'umd:es5': {
      presets: [
        [
          '@babel/env',
          { ...presetEnvConfig, exclude: ['transform-classes', 'transform-typeof-symbol'], targets: { ie: 11 } },
        ],
      ],
      plugins: [removeNamedExports, simpleClassTransform],
    },
  },
}
