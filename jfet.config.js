/**
 * 构建工具配置
 */

const path = require('path');

module.exports = {
  build(abc, context) {
    context.setConfig({
      scanEntry: { pattern: path.join(__dirname, 'src/pages/**/index.js') },
      setOutput: {
        path: path.join(__dirname, 'public'),
        publicPath: '/'
      },
      resolveAliases: {
        vue$: 'vue/dist/vue.common.js',
        src: path.join(__dirname, 'src'),
        assets: path.join(__dirname, 'src/assets'),
        routes: path.join(__dirname, 'src/routes'),
        components: path.join(__dirname, 'src/components')
      },
      defineConstants: {}
    });
  }
};
