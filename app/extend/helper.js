/**
 * helper
 */

// 静态资源表
let manifest = null;

try {
  manifest = require('../../public/manifest.json');
} catch (e) {
  manifest = {};
}

const CSS_REGEX = /\.css(\?.*)?$/;
const JS_REGEX = /\.js(\?.*)?$/;

/**
 * 引入js和css
 * @param {String} filename
 * @return {String}
 */
exports.require = function (filename) {
  const manifestName = manifest[filename];

  if (!manifestName) {
    return '';
  }

  if (CSS_REGEX.test(filename)) {
    return this.safe(wrapperCSS(manifestName));
  }

  if (JS_REGEX.test(filename)) {
    return this.safe(wrapperJS(manifestName));
  }

  return manifestName;
};

function wrapperCSS(uri) {
  return `<link rel="stylesheet" href="${uri}">`;
}

function wrapperJS(uri) {
  return `<script src="${uri}"></script>`;
}
