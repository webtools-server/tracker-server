/**
 * 本地环境配置
 */

module.exports = (appInfo) => {
  const config = {};

  // should change to your own
  config.keys = `${appInfo.name}_local_1502874753953_2868`;

  config.nunjucks = {
    cache: false // local env is false
  };

  config.session = {
    key: 'TRACKER_LOCAL_SESS'
  };

  config.sequelize = {
    database: 'fe_tracker',
    host: '127.0.0.1',
    username: 'root',
    password: 'root123'
  };

  return config;
};
