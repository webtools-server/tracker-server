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
 * 获取明细列表
 * @param {Object} params
 */
export function fetchErrorList(params) {
  return axiosInstance.get('/error/query', { params });
}

/**
 * 获取API明细列表
 * @param {Object} params
 */
export function fetchApiList(params) {
  return axiosInstance.get('/api/query', { params });
}

/**
 * 获取API统计列表
 * @param {Object} params
 */
export function fetchApiStatList(params) {
  return axiosInstance.get('/api/query_stat', { params });
}

/**
 * 按照时间段统计
 * @param {Object} params
 */
export function queryStatByTime(params) {
  return axiosInstance.get('/api/query_stat_by_time', { params });
}

/**
 * 获取性能数据列表
 * @param {Object} params
 */
export function fetchPerfList(params) {
  return axiosInstance.get('/perf/query', { params });
}

/**
 * sourcemap
 * @param {Object} data
 */
export function translate(data = {}) {
  return axiosInstance.post('/error/translate', data);
}

/**
 * 根据日期统计，默认获取7天
 */
export function errorStatByDay() {
  return axiosInstance.get('/error/stat_by_day');
}

/**
 * 根据小时统计
 */
export function errorStatByHour() {
  return axiosInstance.get('/error/stat_by_hour');
}

/**
 * 根据维度统计
 */
export function errorStatByDim() {
  return axiosInstance.get('/error/stat_by_dim');
}

/**
 * 根据日期统计，默认获取7天
 */
export function apiStatByDay() {
  return axiosInstance.get('/api/stat_by_day');
}

/**
 * 根据小时统计
 */
export function apiStatByHour() {
  return axiosInstance.get('/api/stat_by_hour');
}

/**
 * 根据维度统计
 */
export function apiStatByDim() {
  return axiosInstance.get('/api/stat_by_dim');
}

/**
 * 查询项目
 * @param {String|Obejct} [params]
 */
export function queryProject(params) {
  if (typeof params === 'string') {
    return axiosInstance.get(`/project/${params}`);
  }

  return axiosInstance.get('/project', { params });
}

/**
 * 创建项目
 * @param {Object} data
 */
export function createProject(data = {}) {
  return axiosInstance.post('/project', data);
}

/**
 * 修改项目信息
 * @param {String} pid
 * @param {Object} data
 */
export function saveProject(pid, data = {}) {
  return axiosInstance.put(`/project/${pid}`, data);
}

/**
 * 删除项目信息
 * @param {String} pid
 */
export function deleteProject(pid) {
  return axiosInstance.delete(`/project/${pid}`);
}
