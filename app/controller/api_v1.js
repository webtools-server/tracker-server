/**
 * api_v1控制器
 */

const sourceMap = require('source-map');
const moment = require('moment');
const { PAGE_NUM } = require('../common/config');
const { SQL_CONDITION_TYPE, TRACKER_TYPE, RET_CODE, COUNT_TYPE } = require('../common/enum');

module.exports = (app) => {
  class ApiV1Controller extends app.Controller {
    * count() {
      const ctx = this.ctx;
      const type = ctx.params.type;

      switch (type) {
        case COUNT_TYPE.DATE: {
          let day = parseInt(ctx.query.day, 10) || 7;
          let current = moment().day();
          const dayArr = new Array(day);

          while (day) {
            day--;
            const d = moment().day(current--).format('YYYY.MM.DD');
            dayArr[day] = {
              date: d,
              count: yield ctx.service.error.getCountByDate(d)
            };
          }

          ctx.body = {
            code: RET_CODE.OK,
            data: dayArr
          };
          break;
        }
        case COUNT_TYPE.HOUR: {
          const year = moment().year();
          const month = moment().month();
          const date = moment().date();
          let hour = parseInt(ctx.query.hour, 10) || 24;
          const hourArr = new Array(hour);
          let currHour = '';
          let nextHour = '';

          while (hour) {
            nextHour = moment([year, month, date, hour]);
            hour--;
            currHour = moment([year, month, date, hour]);

            hourArr[hour] = {
              time: currHour.format('HH:mm'),
              count: yield ctx.service.error.getCountByHour(currHour.valueOf(), nextHour.valueOf())
            };
          }

          ctx.body = {
            code: RET_CODE.OK,
            data: hourArr
          };
          break;
        }
        case COUNT_TYPE.DIM: {
          ctx.body = {
            code: RET_CODE.OK,
            data: yield ctx.service.error.getDim(moment().format('YYYY.MM.DD'))
          };
          break;
        }
        default: {
          ctx.body = {
            code: RET_CODE.ERROR,
            msg: '类型错误'
          };
          break;
        }
      }
    }

    * query() {
      // ?page=1&timestamp=&platform=ios&pid=&network=&link=
      const ctx = this.ctx;
      const page = parseInt(ctx.query.page, 10) || 1;
      const whereArr = getConditionByQuery(ctx.query, [
        { name: 'platform', type: SQL_CONDITION_TYPE.LIKE },
        { name: 'pid', type: SQL_CONDITION_TYPE.NORMAL },
        { name: 'network', type: SQL_CONDITION_TYPE.LIKE },
        { name: 'link', type: SQL_CONDITION_TYPE.LIKE },
        { name: 'startTime', compare: 'timestamp', type: SQL_CONDITION_TYPE.GTE },
        { name: 'endTime', compare: 'timestamp', type: SQL_CONDITION_TYPE.LTE }
      ]);

      const sqlObj = {
        where: [['op_type', 'error'], ['op_params.t_type', TRACKER_TYPE.ERROR]].concat(whereArr),
        order: [['@timestamp', 'desc']],
        limit: PAGE_NUM,
        offset: (page - 1) * PAGE_NUM
      };

      const jsondata = yield ctx.service.error.query(sqlObj);

      // 如果没有错误
      if (!jsondata.error) {
        ctx.body = {
          code: RET_CODE.OK,
          data: {
            total: jsondata.hits.total,
            currPage: page,
            pageSize: PAGE_NUM,
            list: jsondata.hits.hits.map(d => d._source.op_params)
          }
        };
      } else {
        ctx.body = {
          code: RET_CODE.ERROR,
          msg: jsondata.error.type
        };
      }
    }

    * translate() {
      const ctx = this.ctx;
      const body = ctx.request.body;

      try {
        const sm = yield ctx.service.error.getSourceMap(body.link);
        const smc = new sourceMap.SourceMapConsumer(sm);
        const origin = smc.originalPositionFor({
          line: parseInt(body.row, 10),
          column: parseInt(body.col, 10)
        });

        ctx.body = {
          code: RET_CODE.OK,
          data: {
            origin
          }
        };
      } catch (e) {
        ctx.body = {
          code: RET_CODE.ERROR,
          msg: e.toString()
        };
      }
    }
  }
  return ApiV1Controller;
};

/**
 * 根据传参获取查询条件
 * @param {Object} query
 * @param {Array} fields [{name: 'platform', type: 1}]
 */
function getConditionByQuery(query, fields) {
  return fields.reduce((arr, field) => {
    const currentField = query[field.name];

    if (currentField) {
      switch (field.type) {
        case SQL_CONDITION_TYPE.NORMAL:
          arr.push([`op_params.${field.name}`, currentField]);
          break;
        case SQL_CONDITION_TYPE.LIKE:
          arr.push([`op_params.${field.name}`, { $like: `%${currentField}%` }]);
          break;
        case SQL_CONDITION_TYPE.GTE:
          arr.push([`op_params.${field.compare}`, { $gte: currentField }]);
          break;
        case SQL_CONDITION_TYPE.LTE:
          arr.push([`op_params.${field.compare}`, { $lte: currentField }]);
          break;
        default:
          break;
      }
    }
    return arr;
  }, []);
}

