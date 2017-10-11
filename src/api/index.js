/**
 * 接口请求
 */

import axios from 'axios';
import { Message } from 'element-ui';

const axiosInstance = axios.create({
  baseURL: '/api/v1'
});

axiosInstance.interceptors.response.use((res) => {
  return res.data;
}, (error) => {
  /* eslint-disable new-cap */
  Message({
    message: error.toString(),
    type: 'error'
  });
});

/**
 * 获取列表
 * @param {Object} params
 */
export function fetchErrorList(params) {
  return axiosInstance.get('/query_error', { params });
}

/**
 * 获取API列表
 * @param {Object} params
 */
export function fetchApiList(params) {
  return axiosInstance.get('/query_api', { params });
}

/**
 * sourcemap
 * @param {Object} data
 */
export function translate(data = {}) {
  return axiosInstance.post('/translate', data);
}

/**
 * 根据日期统计，默认获取7天
 */
export function getCountByDate(params) {
  return axiosInstance.get('/count/date', { params });
}

/**
 * 根据小时统计
 */
export function getCountByHour(params) {
  return axiosInstance.get('/count/hour', { params });
}

/**
 * 根据维度统计
 */
export function getCountByDim(params) {
  return axiosInstance.get('/count/dim', { params });
}
