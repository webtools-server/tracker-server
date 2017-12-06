/**
 * 接口数据定时任务
 */

const { TRACKER_TYPE } = require('../common/enum');

exports.schedule = {
  cron: '0 0 */6 * * *', // 6个小时执行一次
  type: 'all',
  immediate: process.env.NODE_ENV === 'production' // production环境下应用启动的时候，立即执行
};

exports.task = function* (ctx) {
  ctx.logger.info('获取API错误数据');
  yield ctx.service.tracker.getAllData(TRACKER_TYPE.API, true);
};
