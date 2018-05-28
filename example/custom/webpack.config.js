const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebappWebpackPlugin = require('../../src/');

const webpack = require('webpack');

module.exports = (env, args) => {
  return {
    context: __dirname,
    entry: './src/app.js',
    output: {
      path: resolve(__dirname, 'public'),
      publicPath: '/',
      filename: 'app.js'
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: './src/index.html',
      }),
      new WebappWebpackPlugin({
        // Your source logo (required)
        logo: './src/favicon.png',
        // Path to store cached data or false/null to disable caching altogether
        // Note: disabling caching may increase build times considerably
        cache: '.wwp-cache',
        // Prefix path for generated assets
        prefix: 'assets/',
        // Inject html links/metadata (requires html-webpack-plugin)
        inject: true,
        // Favicons configuration options. Read more on: https://github.com/evilebottnawi/favicons#usage
        favicons: {
          appName: 'My WebApp with WebApp Webpack Plugin',              // Your application's name. `string`
          appShortName: 'WebApp',                                         // Your application's short name. `string` : Not implemented in favicons library
          appDescription: 'Demo: How to use the webapp webpack plugin', // Your application's description. `string`
          developerName: 'Fake developer',                              // Your (or your developer's) name. `string`
          developerURL: "https://github.com/fake-developer/",           // Your (or your developer's) URL. `string`
          dir: 'auto',                                                  // Primary text direction for name, short_name, and description
          lang: 'en-US',                                                // Primary language for name and short_name
          background: '#AAA',                                           // Background colour for flattened icons. `string`
          theme_color: '#BBB',                                          // Theme color user for example in Android's task switcher. `string`
          display: "standalone",                                        // Preferred display mode: "fullscreen", "standalone", "minimal-ui" or "browser". `string`
          appleStatusBarStyle: 'black-translucent',                       // Color for appleStatusBarStyle : Not implemented in favicons library (black-translucent | default | black)
          orientation: 'any',                                           // Default orientation: "any", "natural", "portrait" or "landscape". `string`
          start_url: "/?utm_source=homescreen",                         // Start URL when launching the application from a device. `string`
          scope: '.',                                                     // Scope : Not implemented in favicons library
          version: "1.0.0",                                             // Your application's version string. `string`
          logging: false,                                               // Print logs to console? `boolean`
          icons: {
            // Platform Options:
            // - offset - offset in percentage
            // - background:
            //   * false - use default
            //   * true - force use default, e.g. set background for Android icons
            //   * color - set background for the specified icons
            //
            android: true,              // Create Android homescreen icon. `boolean` or `{ offset, background }`
            appleIcon: true,            // Create Apple touch icons. `boolean` or `{ offset, background }`
            appleStartup: true,         // Create Apple startup images. `boolean` or `{ offset, background }`
            coast: true,                // Create Opera Coast icon. `boolean` or `{ offset, background }`
            favicons: true,             // Create regular favicons. `boolean`
            firefox: true,              // Create Firefox OS icons. `boolean` or `{ offset, background }`
            windows: true,              // Create Windows 8 tile icons. `boolean` or `{ background }`
            yandex: true                // Create Yandex browser icon. `boolean` or `{ background }`
          }
        },
      }),
      new class {
        apply(compiler) {
          compiler.hooks.make.tapAsync("A", (compilation, callback) => {
            compilation.hooks.webappWebpackPluginBeforeEmit.tapAsync("B", (result, callback) => {
              console.log(result);
              return callback(null, result);
            });

            return callback();
          })
        }
      }
    ],
    stats: "errors-only"
  };
}
