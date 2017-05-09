import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import combineLoaders from 'webpack-combine-loaders';
import postcssNext from 'postcss-cssnext';
import postcssImport from 'postcss-import';

export default {
  devtool: 'eval',

  entry: [
    'webpack-dev-server/client?http://0.0.0.0:1234',
    './src/index',
  ],

  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      inject: 'body',
    }),
  ],



  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel'],
      exclude: /node_modules\/(?!(camelcase-keys|map-obj)\/).*/,
    },{
  test: /\.scss$/,
  use: [
    {
      loader: "style-loader"
    },
    {
      loader: "css-loader",
      options: {
        alias: {
          "../fonts/bootstrap": "bootstrap-sass/assets/fonts/bootstrap"
        }
      }
    },
    {
      loader: "sass-loader",
      options: {
        includePaths: [
          path.resolve("./node_modules/chartist/dist/scss")
        ]
      }
    }
  ]      
    },
     {
      test: /^((?!\.global).)*css$/,
      loader: combineLoaders([{
        loader: 'style-loader',
      }, {
        loader: 'css-loader',
        query: {
          importLoaders: 1,
          modules: true,
          localIdentName: '[name]__[local]___[hash:base64:5]',
        },
      }, {
        loader: 'postcss',
      },
      ]),
    }, {
      test: /\.global.css$/,
      loader: 'style!css!postcss',
    }, {
      test: /\.(ico)$/,
      loader: 'file?name=[path][name].[ext]',
    }, {
      test: /\.(png|svg|eot|woff|woff2)$/,
      loader: 'file?name=assets/[name]-[hash].[ext]',
    }, {
      test: /\.json$/,
      loader: 'json',
    }, {
      test: /\.md/,
      loader: 'raw',
    }],
  },

  postcss(w) {
    return [
      postcssImport({
        path: ['./src/styles','./node_modules/chartist/dist/chartist.css'],
        addDependencyTo: w,
      }),
      postcssNext({
        browsers: ['> 1%', 'last 4 versions'],
      }),
    ];
  },
};
