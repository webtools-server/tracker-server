/**
 * 用户登录验证
 */

module.exports = (options) => {
  const defaultOptions = {
    ignore: ''
  };

  return function* userAuth(next) {
    const opts = Object.assign({}, defaultOptions, options);

    // 跳过/auth，以及opts.ignore中匹配的路径
    if (/^\/auth/.test(this.path) || (opts.ignore && opts.ignore.test(this.path))) {
      return yield next;
    }

    if (!this.session.username) {
      this.redirect(`/auth/login?redirect_url=${encodeURIComponent(this.request.href)}`);
    } else {
      yield next;
    }
  };
};
