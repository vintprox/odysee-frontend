const { WEBPACK_WEB_PORT, LBRY_WEB_API, BRANDED_SITE } = require('../config.js');
const path = require('path');
const fs = require('fs');
const merge = require('webpack-merge');
const baseConfig = require('../webpack.base.config.js');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AfterBuildPlugin = require('@fiverr/afterbuild-webpack-plugin');
const { DefinePlugin, ProvidePlugin } = require('webpack');
const SentryWebpackPlugin = require('@sentry/webpack-plugin');
const { insertToHead, buildHead } = require('./src/html');
const { insertVariableXml, getOpenSearchXml } = require('./src/xml');

const CUSTOM_ROOT = path.resolve(__dirname, '../custom/');
const STATIC_ROOT = path.resolve(__dirname, '../static/');
const UI_ROOT = path.resolve(__dirname, '../ui/');
const DIST_ROOT = path.resolve(__dirname, 'dist/');
const WEB_STATIC_ROOT = path.resolve(__dirname, 'static/');
const WEB_PLATFORM_ROOT = __dirname;
const isProduction = process.env.NODE_ENV === 'production';
const hasSentryToken = process.env.SENTRY_AUTH_TOKEN !== undefined;

// copy static files to dist folder
const copyWebpackCommands = [
  {
    from: `${STATIC_ROOT}/opensearch.xml`,
    to: `${DIST_ROOT}/opensearch.xml`,
    transform(content, path) {
      return insertVariableXml(content.toString(), getOpenSearchXml());
    },
    force: true,
  },
  {
    from: `${STATIC_ROOT}/robots.txt`,
    to: `${DIST_ROOT}/robots.txt`,
    force: true,
  },
  {
    from: `${STATIC_ROOT}/img/favicon.png`,
    to: `${DIST_ROOT}/public/favicon.png`,
    force: true,
  },
  {
    from: `${STATIC_ROOT}/img/favicon-spaceman.png`,
    to: `${DIST_ROOT}/public/favicon-spaceman.png`,
    force: true,
  },
  {
    from: `${STATIC_ROOT}/img/v2-og.png`,
    to: `${DIST_ROOT}/public/v2-og.png`,
  },
  {
    from: `${STATIC_ROOT}/font/`,
    to: `${DIST_ROOT}/public/font/`,
  },
  {
    from: `${WEB_STATIC_ROOT}/pwa/`,
    to: `${DIST_ROOT}/public/pwa/`,
  },
  {
    from: `${WEB_STATIC_ROOT}/pwa/serviceWorker.js`,
    to: `${DIST_ROOT}/`,
  },
];

const CUSTOM_OG_PATH = `${CUSTOM_ROOT}/v2-og.png`;
if (fs.existsSync(CUSTOM_OG_PATH)) {
  copyWebpackCommands.push({
    from: CUSTOM_OG_PATH,
    to: `${DIST_ROOT}/public/v2-og.png`,
    force: true,
  });
}

// clear the dist folder of existing js files before compilation
let regex = /^.*\.(json|js|map)$/;
// only run on nonprod environments to avoid side effects on prod
if (!isProduction) {
  const path = `${DIST_ROOT}/public/`;
  if (fs.existsSync(path)) {
    fs.readdirSync(path)
      .filter((f) => regex.test(f))
      .map((f) => fs.unlinkSync(path + f));
  }
}

const ROBOTS_TXT_PATH = `${CUSTOM_ROOT}/robots.txt`;
if (fs.existsSync(ROBOTS_TXT_PATH)) {
  copyWebpackCommands.push({
    from: ROBOTS_TXT_PATH,
    to: `${DIST_ROOT}/robots.txt`,
    force: true,
  });
}

let plugins = [
  new WriteFilePlugin(),
  new CopyWebpackPlugin(copyWebpackCommands),
  new DefinePlugin({
    IS_WEB: JSON.stringify(true),
    'process.env.SDK_API_URL': JSON.stringify(process.env.SDK_API_URL || LBRY_WEB_API),
  }),
  new ProvidePlugin({
    __: ['i18n.js', '__'],
  }),
  new HtmlWebpackPlugin({
    template: `${STATIC_ROOT}/index-web.html`,
    filename: `${DIST_ROOT}/index.html`,
  }),
  new AfterBuildPlugin(() => {
    try {
      const index = fs.readFileSync(`${DIST_ROOT}/index.html`, { encoding: 'utf8' });
      const tpl = insertToHead(index, buildHead());
      fs.writeFileSync(`${DIST_ROOT}/index.html`, tpl);
    } catch (err) {
      console.error(err.message); // eslint-disable-line no-console
    }
  }),
];

if (isProduction && hasSentryToken) {
  plugins.push(
    new SentryWebpackPlugin({
      include: './dist',
      ignoreFile: '.sentrycliignore',
      ignore: ['node_modules', 'webpack.config.js'],
      configFile: 'sentry.properties',
    })
  );
}

const webConfig = {
  target: 'web',
  entry: {
    ui: '../ui/index.jsx',
  },
  output: {
    filename: '[name]-[hash].js',
    path: path.join(__dirname, 'dist/public/'),
    publicPath: '/public/',
    chunkFilename: '[name]-[chunkhash].js',
  },
  devServer: {
    port: WEBPACK_WEB_PORT,
    contentBase: path.join(__dirname, 'dist'),
    disableHostCheck: true, // to allow debugging with ngrok
  },
  module: {
    rules: [
      {
        loader: 'babel-loader',
        test: /\.jsx?$/,
        options: {
          presets: ['@babel/env', '@babel/react', '@babel/flow'],
          plugins: [
            '@babel/plugin-proposal-optional-chaining',
            '@babel/plugin-proposal-object-rest-spread',
            '@babel/plugin-proposal-class-properties',
          ],
        },
      },
      {
        loader: 'preprocess-loader',
        test: /\.jsx?$/,
        exclude: /node_modules/,
        options: {
          TARGET: 'web',
          BRANDED_SITE: BRANDED_SITE,
          ppOptions: {
            type: 'js',
          },
        },
      },
    ],
  },
  resolve: {
    modules: [UI_ROOT, __dirname],

    alias: {
      // lbryinc: '../extras/lbryinc',
      electron: `${WEB_PLATFORM_ROOT}/stubs/electron.js`,
      fs: `${WEB_PLATFORM_ROOT}/stubs/fs.js`,
    },
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  plugins,
};

module.exports = merge(baseConfig, webConfig);
