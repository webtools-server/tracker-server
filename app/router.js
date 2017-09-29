/**
 * 路由
 */

module.exports = (app) => {
  app.get('/', 'home.index');
  app.get('/auth/login', 'auth.login');
  app.get('/auth/logout', 'auth.logout');
  app.post('/auth/check', 'auth.check');

  // api v1
  app.get('/api/v1/query', 'apiV1.query');
  app.post('/api/v1/translate', 'apiV1.translate');
  app.get('/api/v1/count/:type', 'apiV1.count');
};
