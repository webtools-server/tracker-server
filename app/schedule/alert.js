/**
 * 告警规则定时执行
 */


exports.schedule = {
  interval: '1h', // 间隔1个小时执行一次
  type: 'worker',
  disable: process.env.NODE_ENV !== 'production' // production环境下才执行
};

exports.task = function* (ctx) {
  yield ctx.service.alert.calcAlertRule();
};
