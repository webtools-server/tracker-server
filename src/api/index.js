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
 * 修改项目告警联系人
 * @param {String} id
 * @param {Object} data
 */
export function saveAlertRuleUser(pid, data = {}) {
  return axiosInstance.put(`/project/alert_user/${pid}`, data);
}

/**
 * 删除项目信息
 * @param {String} pid
 */
export function deleteProject(pid) {
  return axiosInstance.delete(`/project/${pid}`);
}

/**
 * 创建用户
 * @param {Object} data
 */
export function createUser(data = {}) {
  return axiosInstance.post('/user', data);
}

/**
 * 根据用户ID查询用户信息
 * @param {String} id
 */
export function queryUser(id) {
  return axiosInstance.get(`/user/${id}`);
}

/**
 * 查询用户列表
 * @param {Obejct} params
 */
export function fetchUserList(params) {
  return axiosInstance.get('/user', { params });
}

/**
 * 修改用户信息
 * @param {String} id
 * @param {Object} data
 */
export function saveUser(id, data = {}) {
  return axiosInstance.put(`/user/${id}`, data);
}

/**
 * 修改用户密码
 * @param {String} id
 * @param {Object} data
 */
export function changePwd(id, data = {}) {
  return axiosInstance.put(`/user/${id}/changepwd`, data);
}

/**
 * 删除用户
 * @param {String} id
 */
export function deleteUser(id) {
  return axiosInstance.delete(`/user/${id}`);
}

/**
 * 创建告警规则
 * @param {Object} data
 */
export function createAlertRule(data = {}) {
  return axiosInstance.post('/alert_rule', data);
}

/**
 * 修改告警规则
 * @param {String} id
 * @param {Object} data
 */
export function saveAlertRule(id, data = {}) {
  return axiosInstance.put(`/alert_rule/${id}`, data);
}

/**
 * 根据项目ID查询告警规则
 * @param {String} id
 */
export function queryAlertRuleByPid(id) {
  return axiosInstance.get(`/alert_rule/project/${id}`);
}

/**
 * 删除告警规则
 * @param {String} id
 */
export function deleteAlertRule(id) {
  return axiosInstance.delete(`/alert_rule/${id}`);
}

/**
 * 获取字段
 */
export function getFields() {
  return axiosInstance.get('/field');
}

/**
 * 获取字段数据
 */
export function getFieldsData() {
  return axiosInstance.get('/field/data');
}
