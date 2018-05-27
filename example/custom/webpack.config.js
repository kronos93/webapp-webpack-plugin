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
        alterFaviconsEmit: (result, options) => {

          result.html = result.html.split('>');

          result.html = result.html
            .filter(html => html.length > 0)
            .map(html => {
              // Repait split
              html += '>';
              // Alter meta theme color, change from background color to theme color
              html = html == `<meta name="theme-color" content="${options.background}">` ? `<meta name="theme-color" content="${options.theme_color}">` : html;
              // Alter meta msapplication tile color, change from background color to theme color
              html = html == `<meta name="msapplication-TileColor" content="${options.background}">` ? `<meta name="msapplication-TileColor" content="${options.theme_color}">` : html;
              // Alter manifest, from manifest.json to manifest.webmanifest, according to example in: https://www.w3.org/TR/appmanifest/#using-a-link-element-to-link-to-a-manifest
              html = (/(rel\=.{1}manifest.{1}.*)/.test(html)) ? html.replace('manifest.json', 'manifest.webmanifest') : html;
              return html;
            })
            .reduce((prev, next) => {
              // Convert to string
              return `${prev}${next}`
            });

          // Alter manifest.json
          result.assets.forEach(file => {
            if (/manifest\.json$/.test(file.name) && !(/(yandex)/.test(file.name))) {
              // Change name of manifest.json to manifest.webmanifest, according to example in: https://www.w3.org/TR/appmanifest/#using-a-link-element-to-link-to-a-manifest
              file.name = file.name.replace('manifest.json', 'manifest.webmanifest');
              const manifestJson = JSON.parse(file.contents);
              // Add some extra options to manifest.webmanifest that favicons library does not return
              // Result validated in: https://manifest-validator.appspot.com/
              manifestJson.scope = options.scope;
              manifestJson.short_name = options.appShortName;
              manifestJson.developer = {
                name: options.developerName,
                url: options.developerURL,
              };
              manifestJson.version = options.version;
              file.contents = JSON.stringify(manifestJson);
            }
          });
          return result;
        },
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
    ],
    stats: "errors-only"
  };
}
