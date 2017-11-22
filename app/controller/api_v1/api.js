/**
 * 接口异常api
 */

const moment = require('moment');
const util = require('../../common/util');
const query = require('../../common/query');
const { PAGE_NUM, API_THRESHOLD } = require('../../common/config');
const {
  SQL_CONDITION_TYPE,
  TRACKER_TYPE,
  RET_CODE
} = require('../../common/enum');

module.exports = (app) => {
  class ApiController extends app.Controller {
    /**
     * 按照最近几天统计
     */
    * statByDay() {
      const ctx = this.ctx;
      const day = parseInt(ctx.params.day, 10) || 7;
      const dayArr = yield ctx.service.tracker.statByDay(TRACKER_TYPE.API, day);

      ctx.body = {
        code: RET_CODE.OK,
        data: dayArr
      };
    }

    /**
     * 按照一天每小时统计
     */
    * statByHour() {
      const ctx = this.ctx;
      const hour = parseInt(ctx.params.hour, 10) || 24;
      const hourArr = yield ctx.service.tracker.statByHour(TRACKER_TYPE.API, hour);

      ctx.body = {
        code: RET_CODE.OK,
        data: hourArr
      };
    }

    /**
     * 按照维度统计
     */
    * statByDim() {
      const ctx = this.ctx;

      ctx.body = {
        code: RET_CODE.OK,
        data: yield ctx.service.tracker.getDim(TRACKER_TYPE.API, moment().format('YYYY.MM.DD'))
      };
    }

    /**
     * 接口异常统计查询
     */
    * queryStat() {
      // ?page=1&platform=ios&network=&&pid=&startTime=&endTime=
      const ctx = this.ctx;
      const page = parseInt(ctx.query.page, 10) || 1;
      const platform = (ctx.query.platform || '').toLowerCase();
      const network = (ctx.query.network || '').toLowerCase();
      const pid = ctx.query.pid || '';
      const startTime = Number(ctx.query.startTime); // 1510919718067  1510918111701
      const endTime = Number(ctx.query.endTime); // 1510919718067

      const jsondata = yield ctx.service.tracker.getAllData(TRACKER_TYPE.API);
      const project = (yield ctx.service.project.findOneByPid(pid)) || {};

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

      const list = jsondata.list;

      if (Array.isArray(list)) {
        list.forEach((val) => {
          const opParams = val._source.op_params;
          const cParams = parseCommonFields(opParams);

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

          const cmd = cpBody.cmd || '';

          const key = util.md5(cpUrl + cmd);
          const idx = util.findIndexFromObjArray(dataList, key);
          const currentData = idx > -1 ? dataList[idx] : Object.assign({
            _key: key,
            url: cmd ? cpUrl : cParams.url,
            cmd
          }, defaultParams);

          // 总响应时长
          currentData.responseTimeTotal += cParams.time;
          // 总响应次数
          currentData.responseTotal++;

          // 总超时次数
          if (cParams.time > apiThreshold) {
            currentData.timeoutCount++;
          }

          // 状态码大于等于400次数
          if (cParams.statusCode >= 400) {
            currentData.statusCodeCount++;
          }

          // api code错误次数
          if (cParams.resultCode || cParams.resultMsg) {
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

      ctx.body = {
        code: RET_CODE.OK,
        data: {
          total: dataList.length,
          currPage: page,
          pageSize: PAGE_NUM,
          list: dataList.slice((page - 1) * PAGE_NUM, ((page - 1) * PAGE_NUM) + PAGE_NUM)
        }
      };
    }

    /**
     * 接口异常查询
     */
    * query() {
      // ?page=1&platform=ios&pid=&network=&link=&startTime=&endTime=&method=&body=
      const ctx = this.ctx;
      const page = parseInt(ctx.query.page, 10) || 1;
      const whereArr = query.getConditionByQuery(
        ctx.query,
        [
          { name: 'platform', type: SQL_CONDITION_TYPE.LIKE },
          { name: 'pid', type: SQL_CONDITION_TYPE.NORMAL },
          { name: 'network', type: SQL_CONDITION_TYPE.LIKE },
          { name: 'link', like: 'c1', type: SQL_CONDITION_TYPE.LIKE },
          { name: 'method', like: 'c1', prefix: 'method:', type: SQL_CONDITION_TYPE.LIKE },
          { name: 'body', like: 'c1', type: SQL_CONDITION_TYPE.LIKE },
          { name: 'startTime', compare: 'timestamp', type: SQL_CONDITION_TYPE.GTE },
          { name: 'endTime', compare: 'timestamp', type: SQL_CONDITION_TYPE.LTE }
        ]
      );

      const sqlObj = {
        where: [
          ['op_type', 'error'],
          ['op_params.t_type', TRACKER_TYPE.API]
        ].concat(whereArr),
        order: [['@timestamp', 'desc']],
        limit: PAGE_NUM,
        offset: (page - 1) * PAGE_NUM
      };

      const jsondata = yield ctx.service.tracker.query(sqlObj);

      // 如果没有错误
      if (!jsondata.error) {
        ctx.body = {
          code: RET_CODE.OK,
          data: {
            total: jsondata.hits.total,
            currPage: page,
            pageSize: PAGE_NUM,
            list: jsondata.hits.hits.map((d) => {
              const curr = d._source.op_params;
              curr.common = parseCommonFields(curr);
              return curr;
            })
          }
        };
      } else {
        ctx.body = {
          code: RET_CODE.ERROR,
          msg: jsondata.error.type
        };
      }
    }
  }
  return ApiController;
};

/**
 * 解析公共字段
 */
function parseCommonFields(obj) {
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
