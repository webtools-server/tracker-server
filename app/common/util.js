/**
 * util
 */

const crypto = require('crypto');

const toStr = Object.prototype.toString;
const hasOwn = Object.prototype.hasOwnProperty;

/**
 * md5加密
 * @param {String} text
 * @return {String}
 */
function md5(text) {
  return crypto.createHash('md5').update(text).digest('hex');
}

/**
 * 字符串转对象
 * @param {String} str
 * @param {String} sep
 * @param {String} subSep
 */
function str2Obj(str = '', sep = ';', subSep = ':') {
  if (!isString(str) || !str) {
    return {};
  }

  return str.split(sep).reduce((obj, item) => {
    const arr = item.split(subSep);

    if (arr[0]) {
      obj[arr[0]] = arr[1];
    }

    return obj;
  }, {});
}

/**
 * 是否对象
 * @param {Object} obj
 * @return {Boolean}
 */
function isObject(obj) {
  return toStr.call(obj) === '[object Object]';
}

/**
 * 是否字符串
 * @param {String} str
 * @return {Boolean}
 */
function isString(str) {
  return toStr.call(str) === '[object String]';
}

/**
 * hasOwnProperty
 * @param {Object} obj
 * @param {Any} k
 */
function hasOwnProp(obj, k) {
  return hasOwn.call(obj, k);
}

module.exports = {
  isObject,
  hasOwnProp,
  md5,
  str2Obj
};
