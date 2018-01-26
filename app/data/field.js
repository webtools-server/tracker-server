/**
 * 字段
 */

module.exports = {
  error: {
    platform: {
      name: '平台',
      type: 'String'
    },
    in_app: {
      name: '是否在app内',
      validator(value) {
        return [0, 1].indexOf(value) > -1;
      }
    },
    cust_id: {
      name: '用户ID',
      type: 'String'
    },
    source: {
      name: '来源',
      type: 'String'
    },
    act_id: {
      name: '活动ID',
      type: 'String'
    },
    link: {
      name: '链接',
      type: 'String'
    },
    ua: {
      name: '用户代理',
      type: 'String'
    },
    title: {
      name: '标题',
      type: 'String'
    },
    network: {
      name: '网络类型',
      type: 'String'
    },
    pid: {
      name: '产品ID',
      type: 'String'
    },
    c1: {
      name: '通用字段1',
      type: 'String'
    },
    c2: {
      name: '通用字段2',
      type: 'String'
    },
    c3: {
      name: '通用字段3',
      type: 'String'
    }
  },
  api: {
    platform: {
      name: '平台',
      type: 'String'
    },
    in_app: {
      name: '是否在app内',
      validator(value) {
        return [0, 1].indexOf(value) > -1;
      }
    },
    cust_id: {
      name: '用户ID',
      type: 'String'
    },
    source: {
      name: '来源',
      type: 'String'
    },
    act_id: {
      name: '活动ID',
      type: 'String'
    },
    link: {
      name: '链接',
      type: 'String'
    },
    ua: {
      name: '用户代理',
      type: 'String'
    },
    title: {
      name: '标题',
      type: 'String'
    },
    network: {
      name: '网络类型',
      type: 'String'
    },
    pid: {
      name: '产品ID',
      type: 'String'
    },
    c1: {
      name: '通用字段1',
      type: 'String'
    },
    c2: {
      name: '通用字段2',
      type: 'String'
    },
    c3: {
      name: '通用字段3',
      type: 'String'
    },
    c_method: {
      name: '请求方法',
      type: 'String'
    },
    c_url: {
      name: '接口url',
      type: 'String'
    },
    c_body: {
      name: 'body参数',
      type: 'String'
    },
    c_time: {
      name: '响应时间',
      type: 'Number'
    },
    c_statusCode: {
      name: '状态码',
      type: 'Number'
    },
    c_resultCode: {
      name: '接口结果code',
      type: ['String', 'Number']
    },
    c_resultMsg: {
      name: '接口结果msg',
      type: 'String'
    }
  },
  perf: {

  }
};

