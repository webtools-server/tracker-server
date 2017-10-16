/**
 * 接口异常api
 */

const moment = require('moment');
const query = require('../../common/query');
const { PAGE_NUM } = require('../../common/config');
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
              const c1 = curr.c1.match(/method:(.*);url:(.*);body:(.*)/) || [];
              const c2 = curr.c2.match(/time:(.*);statusCode:(.*);statusText:(.*)/) || [];

              curr.common = {
                method: c1[1],
                url: c1[2],
                body: c1[3],
                time: c2[1],
                statusCode: c2[2],
                statusText: c2[3],
                result: curr.c3
              };
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
