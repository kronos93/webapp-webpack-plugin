const camelCase = require('camelcase');

/* istanbul ignore next */
module.exports.getAssetPath = ({ mainTemplate }, name, args) => (
  mainTemplate.getAssetPath /* Webpack >= 4.0 */
    ? mainTemplate.getAssetPath(name, args)
    : mainTemplate.applyPluginsWaterfall('asset-path', name, args)
);

/* istanbul ignore next */
module.exports.tap = (tappable, hook, name, plugin) => (
  tappable.hooks /* Webpack >= 4.0 */
    ? tappable.hooks[camelCase(hook)] && tappable.hooks[camelCase(hook)].tapAsync(name, plugin)
    : tappable.plugin(hook, plugin)
);

/* istanbul ignore next */
module.exports.waterfall = (tappable, hook, arg, callback) => {
  if (tappable.hooks) { /* Webpack >= 4.0 */
    tappable.hooks[camelCase(hook)].callAsync(arg, callback);
  } else if (tappable.applyPluginsAsyncWaterfall) {
    tappable.applyPluginsAsyncWaterfall(hook, arg, callback);
  } else {
    throw 'Validate plugin in Webpack < 4';
  }
};

/* istanbul ignore next */
module.exports.getContext = (loader) => (loader.options && loader.options.context) || loader.rootContext;
