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

  config.sequelize = {
    dialect: 'mysql', // support: mysql, mariadb, postgres, mssql
    database: '',
    host: 'localhost',
    port: '3306',
    username: '',
    password: '',
  };

  // 发送邮件配置
  config.transporter = {
    // appName: '',
    // host: '',
    // secure: true,
    // port: 465,
    // auth: {
    //   user: '',
    //   pass: ''
    // }
    appName: 'tracker',
    host: 'smtp.exmail.qq.com',
    secure: true,
    port: 465,
    auth: {
      user: 'h5tool@jyblife.com',
      pass: 'H5tool123456'
    }
  };

  return config;
};
