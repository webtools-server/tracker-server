/**
 * auth控制器
 */

const util = require('../common/util');
const { RET_CODE } = require('../common/enum');

module.exports = (app) => {
  /* eslint-disable require-yield */
  class AuthController extends app.Controller {
    * login() {
      if (this.ctx.session.username) {
        this.ctx.redirect('/');
        return;
      }

      yield this.ctx.render('login.html', {
        title: '登录'
      });
    }

    * logout() {
      if (this.ctx.session.username) {
        this.ctx.session.username = '';
      }

      this.ctx.redirect('/auth/login');
    }

    * check() {
      const ctx = this.ctx;
      const body = ctx.request.body;
      const user = yield ctx.service.user.findOneByUserName(body.username);

      if (user && user.password === util.md5(body.password)) {
        ctx.session.username = body.username;
        ctx.body = {
          code: RET_CODE.OK,
          data: {
            username: body.username
          }
        };
      } else {
        ctx.body = {
          code: RET_CODE.ERROR,
          msg: '用户名或者密码错误'
        };
      }
    }
  }
  return AuthController;
};
