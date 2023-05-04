// const path = require('path');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const postcssPresetEnv = require('postcss-preset-env');

// const mode = process.env.NODE_ENV || 'development';
// const devMode = mode === 'development';
// // const target = devMode ? 'web' : 'browserslist';
// const devtool = devMode ? 'source-map' : undefined;

// module.exports = {
//   mode,
//   target: 'web', // 'browserslist
//   devtool,
//   devServer: {
//     port: 3000,
//     open: true,
//     hot: true,
//   },
//   entry: ['@babel/polyfill', path.resolve(__dirname, 'src', 'main.js')],
//   output: {
//     // filename: '[name].[contenthash].js',
//     filename: 'main.js',
//     path: path.resolve(__dirname, 'virtual-keyboard'),
//     clean: true,
//     assetModuleFilename: 'assets/[name][ext]',
//   },
//   optimization: {
//     runtimeChunk: 'single',
//   },
//   plugins: [
//     new HtmlWebpackPlugin({
//       // filename: '[name].[contenthash].html',
//       filename: 'index.html',
//       template: path.resolve(__dirname, 'src', 'index.html'),
//     }),
//     new MiniCssExtractPlugin({
//       // filename: '[name].[contenthash].css',
//       filename: 'style.css',
//     }),
//   ],
//   module: {
//     rules: [
//       {
//         test: /\.html$/i,
//         loader: 'html-loader',
//       },
//       {
//         test: /\.(c|sa|sc)ss$/i,
//         use: [
//           devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
//           'css-loader',
//           {
//             loader: 'postcss-loader',
//             options: {
//               postcssOptions: {
//                 plugins: [postcssPresetEnv],
//               },
//             },
//           },
//           'sass-loader',
//         ],
//       },
//       {
//         test: /\.(?:ico|gif|svg|png|jpg|jpeg)$/i,
//         type: 'asset/resource',
//       },
//       {
//         test: /\.(?:js|mjs|cjs)$/,
//         exclude: /node_modules/,
//         use: {
//           loader: 'babel-loader',
//           options: {
//             presets: [['@babel/preset-env', { targets: 'defaults' }]],
//           },
//         },
//       },
//     ],
//   },
// };

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const postcssPresetEnv = require('postcss-preset-env');

const mode = process.env.NODE_ENV || 'development';
const devMode = mode === 'development';
const devtool = devMode ? 'source-map' : false;

module.exports = {
  mode,
  target: 'web',
  devtool,
  devServer: {
    port: 3000,
    open: true,
  },
  entry: [path.resolve(__dirname, 'src', 'main.js')],
  output: {
    path: path.resolve(__dirname, 'virtual-keyboard'),
    clean: true,
    filename: 'index.js',
    assetModuleFilename: 'assets/[name][ext]',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src', 'index.html'),
      filename: 'index.html',
    }),

    new MiniCssExtractPlugin({
      filename: 'style.css',
    }),

    // new ESLintPlugin({
    //   overrideConfigFile: path.resolve(__dirname, '.eslintrc.js'),
    // }),
  ],
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [postcssPresetEnv],
              },
            },
          },
          'sass-loader',
        ],
      },
    ],
  },
};
