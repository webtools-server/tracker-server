/**
 * home控制器
 */

module.exports = (app) => {
  class HomeController extends app.Controller {
    * index() {
      yield this.ctx.render('home.html', {
        title: '前端监控系统'
      }, {
        locals: {
          user: {
            username: this.ctx.session.username
          }
        }
      });
    }
  }
  return HomeController;
};
