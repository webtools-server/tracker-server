/**
 * 默认主页
 */

module.exports = (options) => {
  const defaultOptions = {
    index: 'index.html',
    test: /\/book\//
  };

  return function* defaultIndex(next) {
    yield next;

    const opts = Object.assign({}, defaultOptions, options);
    let currPath = this.path;
    const trailingSlash = currPath[currPath.length - 1] === '/';

    if (opts.test.test(currPath) && trailingSlash) {
      currPath += opts.index;
      this.redirect(currPath);
    }
  };
};
