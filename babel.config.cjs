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

module.exports = {
  comments: false,
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
      presets: [['@babel/env', { ...presetEnvConfig, exclude: ['transform-typeof-symbol'], targets: { ie: 11 } }]],
      plugins: [removeNamedExports],
    },
  },
}
