/**
 * 接口请求
 */

import axios from 'axios';
import { Message } from 'element-ui';

const axiosInstance = axios.create({
  baseURL: '/auth'
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
 * 登录校验
 * @param {Object} data
 */
export function check(data = {}) {
  return axiosInstance.post('/check', data);
}

/**
 * 登出
 * @param {Object} params
 */
export function logout(params) {
  return axiosInstance.get('/logout', { params });
}
