/**
 * enum
 */

// sql查询条件类型
const SQL_CONDITION_TYPE = {
  NORMAL: 0, // 普通
  LIKE: 1, // like
  NOT_LIKE: 2, // not like
  GTE: 3, // 大于等于
  LTE: 4 // 小于等于
};

// filter类型
const FILTER_TYPE = {
  CONTAIN: '1',
  NOT_CONTRAIN: '2'
};

// 采集数据类型
const TRACKER_TYPE = {
  ERROR: '1',
  API: '2',
  PERF: '3'
};

// 返回码
const RET_CODE = {
  OK: 0,
  ERROR: -1
};

module.exports = {
  SQL_CONDITION_TYPE,
  FILTER_TYPE,
  TRACKER_TYPE,
  RET_CODE
};
