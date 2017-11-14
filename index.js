/**
 * app
 */

process.env.NODE_ENV = 'production';

require('egg').startCluster({
  baseDir: __dirname,
  workers: 1,
  port: process.env.PORT || 7002
});
