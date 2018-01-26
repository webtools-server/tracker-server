/**
 * api service
 */

const util = require('../common/util');
const { API_THRESHOLD, SLOW_RESPONSE_TIME } = require('../common/config');

module.exports = (app) => {
  class ApiStatService extends app.Service {
    * query(sqlObj) {
      const jsondata = yield this.ctx.service.tracker.query(sqlObj);
      return {
        error: jsondata.error,
        total: jsondata.hits.total,
        list: jsondata.hits.hits.map((d) => {
          const curr = d._source.op_params;
          const commonFields = this.parseCommonFields(curr);
          // 解析得到的通用字段都增加"c_"前缀
          Object.keys(commonFields).forEach((field) => {
            curr[`c_${field}`] = commonFields[field];
          });
          curr.common = commonFields;
          return curr;
        })
      };
    }

    /**
     * 解析公共字段
     */
    parseCommonFields(obj) {
      const c1 = obj.c1.match(/method:(.*);url:(.*);body:(.*)/) || [];
      const c2 = obj.c2.match(/time:(.*);statusCode:(.*);statusText:(.*)/) || [];
      const c3 = obj.c3.match(/(\d+)?(,\s*)?(.*)/) || [];

      return {
        method: c1[1],
        url: c1[2],
        body: c1[3],
        time: parseInt(c2[1] || '', 10),
        statusCode: parseInt(c2[2] || '', 10),
        statusText: c2[3],
        result: obj.c3,
        resultCode: parseInt(c3[1] || '', 10),
        resultMsg: c3[3]
      };
    }

    /**
     * 计算统计数据
     */
    calcTotalData(params = {}, allData = {}, project = {}, isAll = false) {
      const { platform, network, pid, startTime, endTime } = params;

      // 获取到超时响应时间
      const apiThreshold = project.api_threshold || API_THRESHOLD;

      // 数据列表
      const dataList = [];
      // 参数
      const defaultParams = {
        responseTotal: 0, // 总响应次数
        responseTimeTotal: 0, // 总响应时长
        timeoutCount: 0, // 总超时次数，上报超时的总次数
        statusCodeCount: 0, // 状态码错误次数
        apiCodeCount: 0, // apiCode错误次数
        averageResponseTime: 0, // 平均响应时长，平均的超时时长
        slowResponseTime: 0 // 最慢响应时长
      };

      const totalData = Object.assign({}, defaultParams);
      const list = allData.list;

      if (Array.isArray(list)) {
        list.forEach((val) => {
          const opParams = val._source.op_params;
          const cParams = this.parseCommonFields(opParams);

          const opPlatform = (opParams.platform || '').toLowerCase();
          const opNetwork = (opParams.network || '').toLowerCase();

          // 判断是否该条数据是否符合条件
          if (platform && opPlatform.indexOf(platform) > -1) return;
          if (network && opNetwork.indexOf(network) > -1) return;
          if (pid && opParams.pid !== pid) return;
          if (!isNaN(startTime) && startTime > 0 && opParams.timestamp < startTime) return;
          if (!isNaN(endTime) && endTime > 0 && opParams.timestamp > endTime) return;

          const cpBody = util.parseJson(cParams.body);
          const cpUrl = util.getUrlPath(cParams.url);
          let idx = 0;
          let currentData = {}; // 当前数据

          if (!isAll) {
            const cmd = cpBody.cmd || '';
            const key = util.md5(cpUrl + cmd);
            idx = util.findIndexFromObjArray(dataList, key);
            currentData = idx > -1 ? dataList[idx] : Object.assign({
              _key: key,
              url: cmd ? cpUrl : cParams.url,
              cmd
            }, defaultParams);
          } else {
            currentData = totalData;
          }

          if (cParams.time <= SLOW_RESPONSE_TIME) {
            // 总响应时长
            currentData.responseTimeTotal += cParams.time;
            // 总响应次数
            currentData.responseTotal++;
          }

          // 总超时次数
          if (cParams.time > apiThreshold) {
            currentData.timeoutCount++;
          }

          // 状态码大于等于400次数
          if (cParams.statusCode >= 400) {
            currentData.statusCodeCount++;
          }

          // api code错误次数
          if (opParams.c3) {
            currentData.apiCodeCount++;
          }

          // 最慢响应时长
          if (currentData.slowResponseTime < cParams.time) {
            currentData.slowResponseTime = cParams.time;
          }

          // 平均响应时长
          currentData.averageResponseTime = Math.round(currentData.responseTimeTotal / currentData.responseTotal);

          // 如果是没有找到则新增
          if (idx === -1) {
            dataList.push(currentData);
          }
        });
      }

      return isAll ? totalData : dataList;
    }
  }
  return ApiStatService;
};
