/**
 * home控制器
 */

module.exports = (app) => {
  class HomeController extends app.Controller {
    * index() {
      const ctx = this.ctx;
      const title = 'tracker server';

      yield ctx.render('home.html', { title });
    }
  }
  return HomeController;
};
