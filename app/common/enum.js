/**
 * enum
 */

// sql查询条件类型
const SQL_CONDITION_TYPE = {
  NORMAL: 0, // 普通
  LIKE: 1, // like
  GTE: 2, // 大于等于
  LTE: 3 // 小于等于
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
  TRACKER_TYPE,
  RET_CODE
};
