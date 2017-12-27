/**
 * tracker service
 */

const moment = require('moment');
const util = require('../common/util');
const { QUERY_URL, MAX_LIMIT } = require('../common/config');

// 数据缓存
let cache = null;

module.exports = (app) => {
  class TrackerService extends app.Service {
    * statByDay(trackerType, day) {
      let current = moment().day();
      const dayArr = new Array(day);

      while (day) {
        day--;
        const d = moment().day(current--).format('YYYY.MM.DD');
        dayArr[day] = {
          date: d,
          count: yield this.getCountByDate(trackerType, d)
        };
      }

      return dayArr;
    }

    * statByHour(trackerType, hour) {
      const year = moment().year();
      const month = moment().month();
      const date = moment().date();
      const hourArr = new Array(hour);
      let currHour = '';
      let nextHour = '';

      while (hour) {
        nextHour = moment([year, month, date, hour]);
        hour--;
        currHour = moment([year, month, date, hour]);

        hourArr[hour] = {
          time: currHour.format('HH:mm'),
          count: yield this.getCountByHour(trackerType, currHour.valueOf(), nextHour.valueOf())
        };
      }

      return hourArr;
    }

    * getCountByDate(trackerType, date) {
      const sqlContent = `select count(*) from access_app_tracker.app_evt-${date}/push where op_type='error' and op_params.t_type=${trackerType}`;
      const jsondata = yield this.request(sqlContent);

      if (!jsondata.error) {
        return jsondata.hits.total;
      }

      return 0;
    }

    * getCountByHour(trackerType, curr, next) {
      const sqlContent = `select count(*) from access_app_tracker.app_evt-*/push where op_type='error' and op_params.t_type=${trackerType} and op_params.timestamp >= ${curr} and op_params.timestamp < ${next}`;
      const jsondata = yield this.request(sqlContent);

      if (!jsondata.error) {
        return jsondata.hits.total;
      }

      return 0;
    }

    * getDim(trackerType, date) {
      const commonSql = `select count(*) from access_app_tracker.app_evt-${date}/push where op_type='error' and op_params.t_type=${trackerType}`;
      const sqlNetwork = `${commonSql} GROUP BY op_params.network`;
      const sqlPlatform = `${commonSql} GROUP BY op_params.platform`;

      // common
      const commonData = yield this.request(commonSql);
      const commonTotal = !commonData.error ? commonData.hits.total : 0;

      // network
      const networkData = yield this.request(sqlNetwork);
      const networkTotal = !networkData.error ? networkData.aggregations['op_params.network'].buckets : [];

      // platform
      const platformData = yield this.request(sqlPlatform);
      const platformTotal = !platformData.error ? platformData.aggregations['op_params.platform'].buckets : [];

      return {
        network: getDimArr(networkTotal, commonTotal),
        platform: getDimArr(platformTotal, commonTotal)
      };

      function getDimArr(total, ctotal) {
        let docCount = 0;

        return total.reduce((arr, item, i) => {
          docCount += item.doc_count;
          arr.push({
            name: item.key,
            value: item.doc_count
          });

          // 如果是最后一个项，并且小于commonTotal
          if (i === total.length - 1 && docCount < ctotal) {
            arr.push({
              name: 'other',
              value: ctotal - docCount
            });
          }

          return arr;
        }, []);
      }
    }

    * getAllData(type, isNew = false) {
      // 如果不需要重新获取，并且有缓存，直接返回
      if (!isNew && cache) {
        return cache;
      }

      const sqlObj = {
        where: [
          ['op_type', 'error'],
          ['op_params.t_type', type]
        ],
        limit: MAX_LIMIT,
        order: [['@timestamp', 'desc']]
      };
      const jsondata = yield this.ctx.service.tracker.query(sqlObj);

      if (!jsondata.error) {
        // 数据缓存起来
        cache = {
          total: jsondata.hits.total,
          list: jsondata.hits.hits
        };
        return cache;
      }

      return { total: 0, list: [] };
    }

    * query(sqlObj) {
      const sqlStr = 'select * from access_app_tracker.app_evt-*/push';

      // where
      let whereStr = '';
      const sqlCondition = [];
      const currWhere = sqlObj.where || {};

      currWhere.forEach((item) => {
        const c = item[0];
        let curr = item[1];

        // 如果是字符串类型，加上单引号
        if (typeof curr === 'string') {
          curr = `'${curr}'`;
        }

        // 如果where传入对象
        if (util.isObject(curr)) {
          // like
          if (util.hasOwnProp(curr, '$like')) {
            sqlCondition.push(`${c} like '${curr.$like.toLowerCase()}'`);
          }

          // not like
          if (util.hasOwnProp(curr, '$notLike')) {
            sqlCondition.push(`${c} not like '${curr.$notLike.toLowerCase()}'`);
          }

          // gte
          if (util.hasOwnProp(curr, '$gte')) {
            sqlCondition.push(`${c} >= '${curr.$gte}'`);
          }

          // lte
          if (util.hasOwnProp(curr, '$lte')) {
            sqlCondition.push(`${c} <= '${curr.$lte}'`);
          }
        } else {
          sqlCondition.push(`${c}=${curr}`);
        }
      });

      if (sqlCondition.length) {
        whereStr = ` where ${sqlCondition.join(' and ')}`;
      }

      // order
      let orderStr = '';
      const currOrder = sqlObj.order;

      if (Array.isArray(currOrder) && currOrder.length) {
        orderStr = ` order by ${currOrder.map(o => o.join(' ')).join(',')}`;
      }

      // limit
      let limitStr = '';
      if (typeof sqlObj.limit !== 'undefined') {
        limitStr = ` limit ${sqlObj.limit}`;
      }

      // offset
      let offsetStr = '';
      if (typeof sqlObj.offset !== 'undefined') {
        offsetStr = ` offset ${sqlObj.offset}`;
      }

      // 最终执行的查询
      return yield this.request(sqlStr + whereStr + orderStr + limitStr + offsetStr);
    }

    * getSourceMap(url) {
      const result = yield this.ctx.curl(url, {
        method: 'GET'
      });

      if (result.status === 200) {
        return result.data.toString('utf8');
      }

      return '';
    }

    * request(sql) {
      if (process.env.NODE_ENV !== 'production') {
        console.log(sql);
      }

      const result = yield this.ctx.curl(QUERY_URL, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        timeout: 1000 * 60 * 3, // 3分钟超时
        data: { sql },
        dataAsQueryString: true
      });
      return JSON.parse(result.data.toString('utf8'));
    }
  }
  return TrackerService;
};
