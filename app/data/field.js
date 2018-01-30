/**
 * 字段
 */

const util = require('../common/util');

const fieldObj = {
  error: {
    platform: {
      name: '平台',
      value: 'platform',
      type: 'String'
    },
    in_app: {
      name: '是否在app内',
      value: 'in_app',
      validator(value) {
        return [0, 1].indexOf(value) > -1;
      }
    },
    cust_id: {
      name: '用户ID',
      value: 'cust_id',
      type: 'String'
    },
    source: {
      name: '来源',
      value: 'source',
      type: 'String'
    },
    act_id: {
      name: '活动ID',
      value: 'act_id',
      type: 'String'
    },
    link: {
      name: '链接',
      value: 'link',
      type: 'String'
    },
    ua: {
      name: '用户代理',
      value: 'ua',
      type: 'String'
    },
    title: {
      name: '标题',
      value: 'title',
      type: 'String'
    },
    network: {
      name: '网络类型',
      value: 'network',
      type: 'String'
    },
    pid: {
      name: '产品ID',
      value: 'pid',
      type: 'String'
    },
    c1: {
      name: '通用字段1',
      value: 'c1',
      type: 'String'
    },
    c2: {
      name: '通用字段2',
      value: 'c2',
      type: 'String'
    },
    c3: {
      name: '通用字段3',
      value: 'c3',
      type: 'String'
    }
  },
  api: {
    platform: {
      name: '平台',
      value: 'platform',
      type: 'String'
    },
    in_app: {
      name: '是否在app内',
      value: 'in_app',
      validator(value) {
        return [0, 1].indexOf(value) > -1;
      }
    },
    cust_id: {
      name: '用户ID',
      value: 'cust_id',
      type: 'String'
    },
    source: {
      name: '来源',
      value: 'source',
      type: 'String'
    },
    act_id: {
      name: '活动ID',
      value: 'act_id',
      type: 'String'
    },
    link: {
      name: '链接',
      value: 'link',
      type: 'String'
    },
    ua: {
      name: '用户代理',
      value: 'ua',
      type: 'String'
    },
    title: {
      name: '标题',
      value: 'title',
      type: 'String'
    },
    network: {
      name: '网络类型',
      value: 'network',
      type: 'String'
    },
    pid: {
      name: '产品ID',
      value: 'pid',
      type: 'String'
    },
    c1: {
      name: '通用字段1',
      value: 'c1',
      type: 'String'
    },
    c2: {
      name: '通用字段2',
      value: 'c2',
      type: 'String'
    },
    c3: {
      name: '通用字段3',
      value: 'c3',
      type: 'String'
    },
    c_method: {
      name: '请求方法',
      value: 'c_method',
      type: 'String'
    },
    c_url: {
      name: '接口url',
      value: 'c_url',
      type: 'String'
    },
    c_body: {
      name: 'body参数',
      value: 'c_body',
      type: 'String'
    },
    c_time: {
      name: '响应时间',
      value: 'c_time',
      type: 'Number'
    },
    c_statusCode: {
      name: '状态码',
      value: 'c_statusCode',
      type: 'Number'
    },
    c_resultCode: {
      name: '接口结果code',
      value: 'c_resultCode',
      type: ['String', 'Number']
    },
    c_resultMsg: {
      name: '接口结果msg',
      value: 'c_resultMsg',
      type: 'String'
    }
  },
  perf: {
    platform: {
      name: '平台',
      value: 'platform',
      type: 'String'
    },
    in_app: {
      name: '是否在app内',
      value: 'in_app',
      validator(value) {
        return [0, 1].indexOf(value) > -1;
      }
    },
    cust_id: {
      name: '用户ID',
      value: 'cust_id',
      type: 'String'
    },
    source: {
      name: '来源',
      value: 'source',
      type: 'String'
    },
    act_id: {
      name: '活动ID',
      value: 'act_id',
      type: 'String'
    },
    link: {
      name: '链接',
      value: 'link',
      type: 'String'
    },
    ua: {
      name: '用户代理',
      value: 'ua',
      type: 'String'
    },
    title: {
      name: '标题',
      value: 'title',
      type: 'String'
    },
    network: {
      name: '网络类型',
      value: 'network',
      type: 'String'
    },
    pid: {
      name: '产品ID',
      value: 'pid',
      type: 'String'
    },
    c1: {
      name: '通用字段1',
      value: 'c1',
      type: 'String'
    },
    c2: {
      name: '通用字段2',
      value: 'c2',
      type: 'String'
    },
    c3: {
      name: '通用字段3',
      value: 'c3',
      type: 'String'
    },
    c_firstPaintTime: {
      name: '首屏时间',
      value: 'c_firstPaintTime',
      type: 'String'
    },
    c_loadTime: {
      name: '页面加载总时间',
      value: 'c_loadTime',
      type: 'String'
    },
    c_domReadyTime: {
      name: 'DOM加载完成时间',
      value: 'c_domReadyTime',
      type: 'String'
    },
    c_readyStart: {
      name: '准备新页面时间',
      value: 'c_readyStart',
      type: 'String'
    },
    c_redirectTime: {
      name: '重定向时间',
      value: 'c_redirectTime',
      type: 'String'
    },
    c_appcacheTime: {
      name: 'appcache时间',
      value: 'c_appcacheTime',
      type: 'String'
    },
    c_unloadEventTime: {
      name: 'unload文档时间',
      value: 'c_unloadEventTime',
      type: 'String'
    },
    c_lookupDomainTime: {
      name: 'DNS查询时间',
      value: 'c_lookupDomainTime',
      type: 'String'
    },
    c_connectTime: {
      name: 'TCP连接时间',
      value: 'c_connectTime',
      type: 'String'
    },
    c_requestTime: {
      name: 'request请求时间',
      value: 'c_requestTime',
      type: 'String'
    },
    c_initDomTreeTime: {
      name: '请求完毕至DOM加载时间',
      value: 'c_initDomTreeTime',
      type: 'String'
    },
    c_loadEventTime: {
      name: 'load事件时间',
      value: 'c_loadEventTime',
      type: 'String'
    }
  }
};

const errorFieldName = util.normailizeFieldObject(fieldObj.error);
const apiFieldName = util.normailizeFieldObject(fieldObj.api);
const perfFieldName = util.normailizeFieldObject(fieldObj.perf);

module.exports = {
  fieldObj,
  errorFieldName,
  apiFieldName,
  perfFieldName
};

