/**
 * 配置
 */

// 每页数量
const PAGE_NUM = 10;

// 列表最大值
const MAX_LIMIT = 5000;

// 接口响应时间超过该值的时候上报
const API_THRESHOLD = 3000;

// 接口地址
const QUERY_URL = 'http://61.174.8.209:9009/_sql';

module.exports = {
  PAGE_NUM,
  QUERY_URL,
  MAX_LIMIT,
  API_THRESHOLD
};
