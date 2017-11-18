/**
 * 接口数据定时任务
 */

exports.schedule = {
  cron: '0 0 */2 * * *', // 2个小时执行一次
  type: 'all',
  immediate: process.env.NODE_ENV === 'production' // production环境下应用启动的时候，立即执行
};

exports.task = function () {
  console.log('api schedule');
  // this.ctx.logger.info('all&&cron');
};
