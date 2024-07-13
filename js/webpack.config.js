const { merge } = require('webpack-merge');
const { resolve } = require('path');

module.exports = (env, args) => {
  return merge(require('flarum-webpack-config')(), {
    // module: {
    //   rules: [
    //     {
    //       test: /\.(png|jpe?g|gif)$/i,
    //       use: [
    //         {
    //           loader: 'url-loader',
    //           options: {
    //             name: '[path][name].[ext]',
    //             limit: 1024000,
    //           },
    //         },
    //       ],
    //     },
    //   ],
    // },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '#': resolve(__dirname, 'src/@types'),
        $root: resolve(__dirname, '..'),
      },
    },
  });
};
