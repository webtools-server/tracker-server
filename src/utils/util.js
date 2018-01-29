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
