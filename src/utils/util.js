/**
 * util
 */

export function isEmptyObject(obj) {
  for (const k in obj) {
    return false;
  }
  return true;
}

export function isArray(arr) {
  return Array.isArray(arr);
}

export function getLabelByValue(field) {
  if (Array.isArray(field)) {
    return field.reduce((obj, item) => {
      obj[item.value] = item.label;
      return obj;
    }, {});
  }

  return field;
}

/**
 * 获取querystring
 * @param {String} name
 * @param {String} [url] url为空则表从当前页面的url中取
 * @return {String|Null}
 */
export function getQuery(name, url) {
  const u = url || window.location.search.replace('&amp;', '&');
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`);
  const r = u.substr(u.indexOf('?') + 1).match(reg);

  return r != null ? r[2] : '';
}
