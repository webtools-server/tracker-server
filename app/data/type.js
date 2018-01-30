/**
 * 类型
 */

const util = require('../common/util');
const { TRACKER_TYPE } = require('../common/enum');

// 规则类型
const ruleType = {
  error: {
    name: '错误',
    value: TRACKER_TYPE.ERROR
  },
  api: {
    name: '接口',
    value: TRACKER_TYPE.API
  },
  perf: {
    name: '性能',
    value: TRACKER_TYPE.PERF
  }
};

// 统计类型
const statType = {
  total: {
    name: '总数',
    value: '1'
  },
  ratio: {
    name: '比例',
    value: '2'
  }
};

const ruleTypeName = util.normailizeFieldObject(ruleType);
const statTypeName = util.normailizeFieldObject(statType);

module.exports = {
  ruleType,
  statType,
  ruleTypeName,
  statTypeName
};
