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

  config.viewJyb = { // 默认配置，可以自己设置覆盖
    devServer: {
      enable: true, // 是否开启构建服务
      command: 'jfet build -w', // 执行命令
      env: {}, // 环境变量
      timeout: 60 * 1000, // 启动超时时间
      port: 35729, // livereload端口
      watchPath: path.join(appInfo.baseDir, './public/**/*'), // 监听目录，必须为绝对路径
    },
    viewStateKey: '__VIEW_STATE__', // view状态名称，会挂载在window下
    manifest: path.join(appInfo.baseDir, 'public/manifest.json') // manifest.json路径，必须为绝对路径
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
    appName: '',
    host: '',
    secure: true,
    port: 465,
    auth: {
      user: '',
      pass: ''
    }
  };

  // tracker配置
  config.sysAdmin = {
    pageNum: 10, // 每页数量
    maxLimit: 100, // 列表最大值
    apiThreshold: 3000, // 接口响应时间超过该值的时候上报
    slowResponseTime: 10000, // 接口最慢响应时间，统计报表计算平均响应时间的时候会过滤掉
    queryUrl: 'http://120.132.109.152:9009/_sql' // 接口地址
  };

  return config;
};
