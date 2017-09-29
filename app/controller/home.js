/**
 * home控制器
 */

module.exports = (app) => {
  class HomeController extends app.Controller {
    * index() {
      yield this.ctx.render('home.html', {
        title: 'tracker',
        viewState: {
          user: { username: this.ctx.session.username }
        }
      });
    }
  }
  return HomeController;
};
