const path = require('path')
const rules = require('./webpack.rules');
const BabiliPlugin = require('babili-webpack-plugin')
// const WorkboxPlugin = require('workbox-webpack-plugin');

// Babel loader for Transpiling ES8 Javascript for browser usage
rules.push({
  test: /\.js$/,
  loader: 'babel-loader',
  include: [path.resolve(__dirname, '../app')],
  query: { presets: ['es2017'] }
});


// SCSS loader for transpiling SCSS files to CSS
rules.push({
  test: /\.scss$/,
  loader: 'style-loader!css-loader!sass-loader'
});


// URL loader to resolve data-urls at build time
rules.push({
  test: /\.(jpg|png|woff|woff2|eot|ttf|svg)$/,
  loader: 'url-loader?limit=100000'
});

rules.push({
  test: /\.html$/,
  use: [{
    loader: 'html-loader',
    options: {
      minimize: true
    }
  }]
  // use: 'html-loader'
});

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});


module.exports = {
  // plugins: [
  //        new WorkboxPlugin.GenerateSW({
  //            // these options encourage the ServiceWorkers to get in there fast
  //            // and not allow any straggling "old" SWs to hang around
  //            clientsClaim: true,
  //            skipWaiting: true
  //        })
  //    ],

  // Put your normal webpack config below here
  module: {
    rules,
  },
};

