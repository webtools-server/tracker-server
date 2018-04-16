/**
 * 构建工具配置
 */

const path = require('path');
const fse = require('fs-extra');

module.exports = {
  build(abc, context) {
    const publicDir = path.resolve(__dirname, '..', 'public');

    context.setConfig({
      scanEntry: { pattern: path.join(__dirname, 'pages/**/index.js') },
      setOutput: {
        path: publicDir,
        publicPath: '/'
      },
      resolveAliases: {
        '@': path.join(__dirname),
        vue$: 'vue/dist/vue.common.js',
        assets: path.join(__dirname, 'assets'),
        routes: path.join(__dirname, 'routes'),
        components: path.join(__dirname, 'components')
      },
      sass: {
        includePaths: [path.join(__dirname, 'node_modules')]
      },
      defineConstants: {}
    });

    context.on('before', () => {
      fse.emptyDirSync(publicDir);
    });
  }
};
