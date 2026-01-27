const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')
const HTMLPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')

const vueLoaderConfig = require('../vue-loader.config')
const { mergeCSSLoader } = require('../utils')

const isDev = process.env.NODE_ENV === 'development'

module.exports = {
  target: 'web',
  entry: {
    renderer: path.join(__dirname, '../../src/renderer/main.ts'),
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, '../../dist'),
    publicPath: '',
  },
  resolve: {
    alias: {
      '@root': path.join(__dirname, '../../src'),
      '@main': path.join(__dirname, '../../src/main'),
      '@renderer': path.join(__dirname, '../../src/renderer'),
      '@lyric': path.join(__dirname, '../../src/renderer-lyric'),
      '@static': path.join(__dirname, '../../src/static'),
      '@common': path.join(__dirname, '../../src/common'),
      'electron': path.join(__dirname, '../../src/mock'),
      '@renderer/worker': path.join(__dirname, '../../src/mock'),
      '@renderer/utils/music': path.join(__dirname, '../../src/mock'),
      '@renderer/utils/data': path.join(__dirname, '../../src/mock'),
      '@renderer/utils/message': path.join(__dirname, '../../src/mock'),
      '@renderer/store': path.join(__dirname, '../../src/mock'),
      '@renderer/store/list/action': path.join(__dirname, '../../src/mock'),
      '@renderer/store/list/state': path.join(__dirname, '../../src/mock'),
      '@renderer/store/songList/action': path.join(__dirname, '../../src/mock'),
      '@renderer/store/songList/state': path.join(__dirname, '../../src/mock'),
      '@renderer/store/player/lyric': path.join(__dirname, '../../src/mock'),
      '@renderer/store/player/state': path.join(__dirname, '../../src/mock'),
      '@renderer/store/player/action': path.join(__dirname, '../../src/mock'),
      '@renderer/store/player/volume': path.join(__dirname, '../../src/mock'),
      '@renderer/store/player/playbackRate': path.join(__dirname, '../../src/mock'),
      '@renderer/store/player/playProgress': path.join(__dirname, '../../src/mock'),
      '@renderer/store/setting': path.join(__dirname, '../../src/mock'),
      '@renderer/store/download/utils': path.join(__dirname, '../../src/mock'),
      '@renderer/store/list/syncSourceList': path.join(__dirname, '../../src/mock'),
      '@renderer/plugins/player': path.join(__dirname, '../../src/mock'),
      '@renderer/plugins/i18n': path.join(__dirname, '../../src/mock'),
      '@renderer/plugins/Dialog': path.join(__dirname, '../../src/mock'),
      '@renderer/utils/ipc': path.join(__dirname, '../../src/mock'),
      '@renderer/utils/musicSdk': path.join(__dirname, '../../src/mock'),
      '@renderer/utils/musicSdk/api-source': path.join(__dirname, '../../src/mock'),
      '@renderer/core/player': path.join(__dirname, '../../src/mock'),
      '@renderer/core/player/action': path.join(__dirname, '../../src/mock'),
      '@renderer/core/player/utils': path.join(__dirname, '../../src/mock'),
      '@renderer/core/apiSource': path.join(__dirname, '../../src/mock'),
      '@renderer/core/dislikeList': path.join(__dirname, '../../src/mock'),
      '@renderer/core/lyric': path.join(__dirname, '../../src/mock'),
      '@renderer/core/music': path.join(__dirname, '../../src/mock'),
      '@renderer/core/music/download': path.join(__dirname, '../../src/mock'),
      '@renderer/core/music/local': path.join(__dirname, '../../src/mock'),
      '@renderer/core/music/online': path.join(__dirname, '../../src/mock'),
      '@renderer/core/music/utils': path.join(__dirname, '../../src/mock'),
      '@renderer/useApp/compositions/usePlaySonglist': path.join(__dirname, '../../src/mock'),
      '@renderer/useApp/useDeeplink/utils': path.join(__dirname, '../../src/mock'),
      '@common/utils/vueTools': path.join(__dirname, '../../src/mock'),
      '@common/utils/common': path.join(__dirname, '../../src/mock'),
      '@common/utils/tools': path.join(__dirname, '../../src/mock'),
      '@common/utils/musicMeta': path.join(__dirname, '../../src/mock'),
      '@common/utils/download': path.join(__dirname, '../../src/mock'),
      '@common/utils/nodejs': path.join(__dirname, '../../src/mock'),
      '@common/hotKey': path.join(__dirname, '../../src/mock'),
      '@common/constants': path.join(__dirname, '../../src/mock'),
      '@common/defaultSetting': path.join(__dirname, '../../src/mock'),
      '@common/ipcNames': path.join(__dirname, '../../src/mock'),
      '@common/types/app_setting': path.join(__dirname, '../../src/mock'),
      '@common/types/common': path.join(__dirname, '../../src/mock'),
      '@common/types/user_api': path.join(__dirname, '../../src/mock'),
      '@common/types/sync': path.join(__dirname, '../../src/mock'),
      '@common/types/list_sync': path.join(__dirname, '../../src/mock'),
      '@common/types/music': path.join(__dirname, '../../src/mock'),
      '@common/types/list': path.join(__dirname, '../../src/mock'),
      '@common/types/download_list': path.join(__dirname, '../../src/mock'),
      '@common/types/player': path.join(__dirname, '../../src/mock'),
      '@common/types/shims_vue': path.join(__dirname, '../../src/mock'),
      '@common/types/utils': path.join(__dirname, '../../src/mock'),
      '@common/types/theme': path.join(__dirname, '../../src/mock'),
      '@common/types/desktop_lyric': path.join(__dirname, '../../src/mock'),
      '@common/types/ipc_renderer': path.join(__dirname, '../../src/mock'),
      '@common/types/config_files': path.join(__dirname, '../../src/mock'),
      '@common/types/music_metadata': path.join(__dirname, '../../src/mock'),
      '@common/types/sound_effect': path.join(__dirname, '../../src/mock'),
      '@common/types/dislike_list': path.join(__dirname, '../../src/mock'),
      '@common/types/open_api': path.join(__dirname, '../../src/mock'),
      '@root/lang': path.join(__dirname, '../../src/mock'),
      '@renderer/utils': path.join(__dirname, '../../src/mock'),
      '@renderer/utils/simplify-chinese-main': path.join(__dirname, '../../src/mock'),
    },
    extensions: ['.tsx', '.ts', '.js', '.json', '.node'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: [/node_modules/, /src\/main/],
        use: {
          loader: 'ts-loader',
          options: {
            appendTsSuffixTo: [/\.vue$/],
          },
        },
        parser: {
          worker: [
            '*audioContext.audioWorklet.addModule()',
            '...',
          ],
        },
      },
      {
        test: /\.node$/,
        use: 'node-loader',
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig,
      },
      {
        test: /\.pug$/,
        loader: 'pug-plain-loader',
      },
      {
        test: /\.css$/,
        oneOf: mergeCSSLoader(),
      },
      {
        test: /\.less$/,
        oneOf: mergeCSSLoader({
          loader: 'less-loader',
          options: {
            sourceMap: true,
          },
        }),
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        exclude: path.join(__dirname, '../../src/renderer/assets/svgs'),
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10000,
          },
        },
        generator: {
          filename: 'imgs/[name]-[contenthash:8][ext]',
        },
      },
      {
        test: /\.svg$/,
        include: path.join(__dirname, '../../src/renderer/assets/svgs'),
        use: [
          {
            loader: 'svg-sprite-loader',
            options: {
              symbolId: 'icon-[name]',
            },
          },
          'svg-transform-loader',
          'svgo-loader',
        ],
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10000,
          },
        },
        generator: {
          filename: 'media/[name]-[contenthash:8][ext]',
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10000,
          },
        },
        generator: {
          filename: 'fonts/[name]-[contenthash:8][ext]',
        },
      },
    ],
  },
  plugins: [
    new HTMLPlugin({
      filename: 'index.html',
      template: path.join(__dirname, '../../src/renderer/index.html'),
      isProd: process.env.NODE_ENV == 'production',
      browser: process.browser,
      __dirname,
    }),
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: isDev ? '[name].css' : '[name].[contenthash:8].css',
      chunkFilename: isDev ? '[id].css' : '[id].[contenthash:8].css',
    }),
    new ESLintPlugin({
      extensions: ['js', 'vue'],
      formatter: require('eslint-formatter-friendly'),
    }),
  ],
}
