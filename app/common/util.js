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
 * 是否对象
 * @param {Object} obj
 * @return {Boolean}
 */
function isObject(obj) {
  return toStr.call(obj) === '[object Object]';
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
  md5
};
