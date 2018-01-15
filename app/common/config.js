/**
 * 配置
 */

const isProd = process.env.NODE_ENV === 'production';

// 每页数量
const PAGE_NUM = 10;

// 列表最大值
const MAX_LIMIT = isProd ? 10000 : 100;

// 接口响应时间超过该值的时候上报
const API_THRESHOLD = 3000;

// 接口最慢响应时间，统计报表计算平均响应时间的时候会过滤掉
const SLOW_RESPONSE_TIME = 10000;

// 接口地址
const QUERY_URL = 'http://120.132.109.152:9009/_sql';

module.exports = {
  PAGE_NUM,
  QUERY_URL,
  MAX_LIMIT,
  API_THRESHOLD,
  SLOW_RESPONSE_TIME
};
