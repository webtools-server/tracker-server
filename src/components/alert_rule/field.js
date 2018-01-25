/**
 * 字段
 */

// 规则类型
export const RULE_TYPE = [{
  label: '错误',
  value: '1'
}, {
  label: '接口',
  value: '2'
}, {
  label: '性能',
  value: '3'
}];
export const fieldRuleType = getLabelByValue(RULE_TYPE);

// 字段名称
export const FIELDS_NAME = [{
  label: '错误msg',
  value: 'c1'
}, {
  label: '网络类型',
  value: 'network'
}, {
  label: '状态码',
  value: 'statusCode'
}];
export const fieldFieldsName = getLabelByValue(FIELDS_NAME);

// 字段运算
export const FIELDS_ACTION = [{
  label: '小于',
  value: '1'
}, {
  label: '小于等于',
  value: '2'
}, {
  label: '大于',
  value: '3'
}, {
  label: '大于等于',
  value: '4'
}, {
  label: '等于',
  value: '5'
}, {
  label: '不等于',
  value: '6'
}, {
  label: '包含',
  value: '7'
}, {
  label: '不包含',
  value: '8'
}];
export const fieldFieldsAction = getLabelByValue(FIELDS_ACTION);

// 统计类型
export const STAT_TYPE = [{
  label: '总数',
  value: '1'
}, {
  label: '比例',
  value: '2'
}];
export const fieldStatType = getLabelByValue(STAT_TYPE);

// 统计运算
export const STAT_ACTION = [{
  label: '小于',
  value: '1'
}, {
  label: '小于等于',
  value: '2'
}, {
  label: '大于',
  value: '3'
}, {
  label: '大于等于',
  value: '4'
}, {
  label: '等于',
  value: '5'
}, {
  label: '不等于',
  value: '6'
}];
export const fieldStatAction = getLabelByValue(STAT_ACTION);

function getLabelByValue(field) {
  if (Array.isArray(field)) {
    return field.reduce((obj, item) => {
      obj[item.value] = item.label;
      return obj;
    }, {});
  }

  return field;
}
