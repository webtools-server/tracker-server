/**
 * 路由
 */

module.exports = (app) => {
  app.get('/', 'home.index');
  app.get('/auth/login', 'auth.login');
  app.get('/auth/logout', 'auth.logout');
  app.post('/auth/check', 'auth.check');

  // api v1
  app.get('/api/v1/error/query', 'apiV1.error.query');
  app.get('/api/v1/error/stat_by_day/:day?', 'apiV1.error.statByDay');
  app.get('/api/v1/error/stat_by_hour/:hour?', 'apiV1.error.statByHour');
  app.get('/api/v1/error/stat_by_dim', 'apiV1.error.statByDim');
  app.post('/api/v1/error/translate', 'apiV1.error.translate');

  app.get('/api/v1/api/query', 'apiV1.api.query');
  app.get('/api/v1/api/query_stat', 'apiV1.api.queryStat');
  app.get('/api/v1/api/query_stat_by_time', 'apiV1.api.queryStatByTime');
  app.get('/api/v1/api/stat_by_day/:day?', 'apiV1.api.statByDay');
  app.get('/api/v1/api/stat_by_hour/:hour?', 'apiV1.api.statByHour');
  app.get('/api/v1/api/stat_by_dim', 'apiV1.api.statByDim');

  app.get('/api/v1/perf/query', 'apiV1.perf.query');

  app.post('/api/v1/project', 'apiV1.project.createOne');
  app.delete('/api/v1/project/:pid', 'apiV1.project.deleteOne');
  app.put('/api/v1/project/:pid', 'apiV1.project.putOne');
  app.get('/api/v1/project/:pid?', 'apiV1.project.query');
};
