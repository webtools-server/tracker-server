/**
 * util
 */

const toStr = Object.prototype.toString;
const hasOwn = Object.prototype.hasOwnProperty;

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
  hasOwnProp
};
