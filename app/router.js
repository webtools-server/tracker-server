/**
 * 路由
 */

module.exports = (app) => {
  app.get('/', 'home.index');
  app.get('/api/v1/calc_alert_rule', 'apiV1.field.calcAlertRule');

  // 验证
  app.get('/auth/login', 'auth.login');
  app.get('/auth/logout', 'auth.logout');
  app.post('/auth/check', 'auth.check');

  // 错误
  app.get('/api/v1/error/query', 'apiV1.error.query');
  app.get('/api/v1/error/stat_by_day/:day?', 'apiV1.error.statByDay');
  app.get('/api/v1/error/stat_by_hour/:hour?', 'apiV1.error.statByHour');
  app.get('/api/v1/error/stat_by_dim', 'apiV1.error.statByDim');
  app.post('/api/v1/error/translate', 'apiV1.error.translate');

  // 接口
  app.get('/api/v1/api/query', 'apiV1.api.query');
  app.get('/api/v1/api/query_stat', 'apiV1.api.queryStat');
  app.get('/api/v1/api/query_stat_by_time', 'apiV1.api.queryStatByTime');
  app.get('/api/v1/api/stat_by_day/:day?', 'apiV1.api.statByDay');
  app.get('/api/v1/api/stat_by_hour/:hour?', 'apiV1.api.statByHour');
  app.get('/api/v1/api/stat_by_dim', 'apiV1.api.statByDim');

  // 性能
  app.get('/api/v1/perf/query', 'apiV1.perf.query');

  // 项目
  app.post('/api/v1/project', 'apiV1.project.createOne');
  app.delete('/api/v1/project/:pid', 'apiV1.project.deleteOne');
  app.put('/api/v1/project/alert_user/:pid', 'apiV1.project.putAlertUser');
  app.put('/api/v1/project/:pid', 'apiV1.project.putOne');
  app.get('/api/v1/project/:pid?', 'apiV1.project.query');

  // 字段
  app.get('/api/v1/field/data', 'apiV1.field.getFieldsData');
  app.get('/api/v1/field/:type?', 'apiV1.field.getFields');

  // 告警规则
  app.post('/api/v1/alert_rule', 'apiV1.alertRule.createOne');
  app.delete('/api/v1/alert_rule/:id', 'apiV1.alertRule.deleteOne');
  app.put('/api/v1/alert_rule/:id', 'apiV1.alertRule.putOne');
  app.get('/api/v1/alert_rule/project/:pid', 'apiV1.alertRule.queryByPid');

  // 告警日志
  app.get('/api/v1/alert_log', 'apiV1.alertLog.query');

  // 用户
  app.post('/api/v1/user', 'apiV1.user.createOne');
  app.delete('/api/v1/user/:id', 'apiV1.user.deleteOne');
  app.put('/api/v1/user/:id/changepwd', 'apiV1.user.changePwd');
  app.put('/api/v1/user/:id', 'apiV1.user.putOne');
  app.get('/api/v1/user/:id', 'apiV1.user.queryOne');
  app.get('/api/v1/user', 'apiV1.user.query');
};
