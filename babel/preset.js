'use strict';

var relative = require( 'require-relative' );

var baseLocation = require.resolve( 'babel-preset-es2015' );
var plugins = require( baseLocation ).plugins.slice();

var commonjsPlugin = relative( 'babel-plugin-transform-es2015-modules-commonjs', baseLocation );

module.exports = { plugins: plugins.filter((plugin) => plugin !== commonjsPlugin && plugin[0] !== commonjsPlugin) };
