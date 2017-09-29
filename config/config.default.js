/**
 * 默认配置
 */

const path = require('path');

module.exports = (appInfo) => {
  const config = {};

  // should change to your own
  config.keys = `${appInfo.name}_1502874753953_2868`;

  config.middleware = [
    'userAuth'
  ];

  config.static = {
    prefix: '',
    dir: path.join(appInfo.baseDir, 'public'),
  };

  config.multipart = {
    fileSize: '50mb'
  };

  config.view = {
    defaultViewEngine: 'nunjucks'
  };

  config.security = {
    csrf: {
      ignore: ['/api', '/auth']
    }
  };

  return config;
};
