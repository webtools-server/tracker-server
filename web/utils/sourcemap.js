/**
 * 获取sourcemap信息
 */

// sourcemap地址
const DEFAULT_URL = 'http://172.16.1.8:8079';

const JS_REG = /\.js$/;
const CSS_REG = /\.css$/;

/**
 * 获取sourcemap地址
 * @param {String} url
 * @return {String}
 */
export function getURL(url = '') {
  const pos = url.indexOf('?');
  let filename = '';

  if (pos > -1) {
    url = url.slice(0, pos);
  }

  // 文件名
  filename = url.slice(url.lastIndexOf('/') + 1);

  // js文件
  if (JS_REG.test(filename)) {
    return `${DEFAULT_URL}/js/${filename}.map`;
  }

  // css文件
  if (CSS_REG.test(filename)) {
    return `${DEFAULT_URL}/css/${filename}.map`;
  }

  return '';
}

/**
 * 获取行列号
 * @param {String} msg
 * @param {String} stack
 */
export function getRowAndCol(msg = '', stack = '') {
  const arr = msg.split(',');
  const info = {
    row: 0,
    col: 0
  };

  if (arr.length) {
    info.row = parseInt(arr[arr.length - 2], 10) || 0;
    info.col = parseInt(arr[arr.length - 1], 10) || 0;
  }

  return info;
}
