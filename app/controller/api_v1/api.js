/**
 * 接口异常api
 */

const Moment = require('moment');
const MomentRange = require('moment-range');
const query = require('../../common/query');
const { PAGE_NUM } = require('../../common/config');
const {
  SQL_CONDITION_TYPE,
  TRACKER_TYPE,
  RET_CODE
} = require('../../common/enum');

const moment = MomentRange.extendMoment(Moment);

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
     * 按照时间段统计
     */
    * queryStatByTime() {
      // ?platform=ios&network=&&pid=&startTime=&endTime=
      const ctx = this.ctx;
      const platform = (ctx.query.platform || '').toLowerCase();
      const network = (ctx.query.network || '').toLowerCase();
      const pid = ctx.query.pid || '';
      const startTime = Number(ctx.query.startTime); // 1510919718067  1510918111701
      const endTime = Number(ctx.query.endTime); // 1510919718067

      const jsondata = yield ctx.service.tracker.getAllData(TRACKER_TYPE.API);
      const project = (yield ctx.service.project.findOneByPid(pid)) || {};

      // dataList
      let dataList = [];

      // startTime,endTime值不正确，或者startTime大于endTime，计算今天的统计数据
      if (!startTime || !endTime || startTime > endTime) {
        let hour = 24;
        const year = moment().year();
        const month = moment().month();
        const date = moment().date();
        dataList = new Array(hour);
        let currHour = '';
        let nextHour = '';

        while (hour) {
          nextHour = moment([year, month, date, hour]);
          currHour = moment([year, month, date, --hour]);
          const result = ctx.service.api.calcTotalData({
            platform,
            network,
            pid,
            startTime: currHour.valueOf(),
            endTime: nextHour.valueOf()
          }, jsondata, project, true);

          dataList[hour] = {
            ...result,
            xAxis: currHour.format('HH:mm')
          };
        }
      } else {
        const range = moment.range(startTime, endTime);
        const rangeClone = range.clone();
        let currDay = '';
        let nextDay = '';

        rangeClone.start.add(-1, 'days');
        const days = Array.from(rangeClone.by('day')).map(m => m.format('YYYY-MM-DD'));

        for (let i = 1, l = days.length; i < l; i++) {
          currDay = moment(days[i - 1]);
          nextDay = moment(days[i]);
          const result = ctx.service.api.calcTotalData({
            platform,
            network,
            pid,
            startTime: currDay.valueOf(),
            endTime: nextDay.valueOf()
          }, jsondata, project, true);

          dataList.push({
            ...result,
            xAxis: nextDay.format('YYYY-MM-DD')
          });
        }
      }

      ctx.body = {
        code: RET_CODE.OK,
        data: dataList
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
      const dataList = ctx.service.api.calcTotalData({ platform, network, pid, startTime, endTime }, jsondata, project);

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
              curr.common = ctx.service.api.parseCommonFields(curr);
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

