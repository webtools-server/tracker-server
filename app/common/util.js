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
 * @param {Any} obj
 * @return {Boolean}
 */
function isObject(obj) {
  return toStr.call(obj) === '[object Object]';
}

/**
 * 是否字符串
 * @param {Any} str
 * @return {Boolean}
 */
function isString(str) {
  return toStr.call(str) === '[object String]';
}

/**
 * 是否布尔值
 * @param {Any} bool
 * @return {Boolean}
 */
function isBoolean(bool) {
  return toStr.call(bool) === '[object Boolean]';
}

/**
 * 是否错误类型
 * @param {Object} ex
 * @return {Boolean}
 */
function isError(ex) {
  return toStr.call(ex) === '[object Error]';
}

/**
 * hasOwnProperty
 * @param {Object} obj
 * @param {Any} k
 */
function hasOwnProp(obj, k) {
  return hasOwn.call(obj, k);
}

/**
 * 解析为json格式
 * @param {Object} json
 */
function parseJson(json) {
  try {
    const res = JSON.parse(json);
    if (!isObject(res)) {
      return parseJson(res);
    }
    return res;
  } catch (e) {
    return {};
  }
}

/**
 * 获取URL路径
 * @param {String}
 * @return {String}
 */
function getUrlPath(urlStr) {
  return String(urlStr).slice(0, urlStr.indexOf('?'));
}

/**
 * 根据_key从对象数组中查找对象
 * @param {Array} arr
 * @param {Any} key
 * @return {Number} 成功返回数组下标，失败返回-1
 */
function findIndexFromObjArray(arr, key) {
  if (!Array.isArray(arr)) return -1;

  for (let i = 0, l = arr.length; i < l; i++) {
    if (arr[i]._key === key) {
      return i;
    }
  }

  return -1;
}

/**
 * 转换字段对象格式
 * @param {Object} fields
 * @return {Object}
 */
function normailizeFieldObject(fields) {
  return Object.keys(fields).reduce((obj, field) => {
    const curr = fields[field];
    obj[curr.value] = curr.name;
    return obj;
  }, {});
}

module.exports = {
  isObject,
  isBoolean,
  isError,
  hasOwnProp,
  md5,
  str2Obj,
  parseJson,
  getUrlPath,
  findIndexFromObjArray,
  normailizeFieldObject
};
