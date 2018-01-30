/**
 * 告警规则定时执行
 */


exports.schedule = {
  interval: '30m', // 间隔30分钟执行一次
  type: 'worker',
  disable: process.env.NODE_ENV !== 'production' // production环境下才执行
};

exports.task = function* (ctx) {
  yield ctx.service.alert.calcAlertRule();
};
