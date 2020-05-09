const path = require('path');
const GenLocalesWebpackPlugin = require('../src/index')

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new GenLocalesWebpackPlugin({
      path: './src/i18n',
      target: 'locales.json'
    }),
  ],
};