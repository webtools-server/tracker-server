/**
 * 路由
 */

module.exports = (app) => {
  app.get('/', 'home.index');

  // api v1
  app.get('/api/v1/query', 'apiV1.query');
};
