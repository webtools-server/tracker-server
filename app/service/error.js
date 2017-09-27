/**
 * error service
 */

const util = require('../common/util');
const { QUERY_URL } = require('../common/config');

module.exports = (app) => {
  class ErrorService extends app.Service {
    * query(sqlObj) {
      const sqlStr = 'select * from access_app_tracker.app_evt-*/push';

      // where
      let whereStr = '';
      const sqlCondition = [];
      const currWhere = sqlObj.where || {};

      for (const c in currWhere) {
        let curr = currWhere[c];
        // 如果是字符串类型，加上单引号
        if (typeof curr === 'string') {
          curr = `'${curr}'`;
        }

        // 如果where传入对象，并且包含$like
        if (util.isObject(curr) && util.hasOwnProp(curr, '$like')) {
          sqlCondition.push(`${c} like '${curr.$like}'`);
        } else {
          sqlCondition.push(`${c}=${curr}`);
        }
      }

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
      const sqlContent = sqlStr + whereStr + orderStr + limitStr + offsetStr;
      if (process.env.NODE_ENV !== 'production') {
        console.log(sqlContent);
      }
      const result = yield this.ctx.curl(QUERY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        content: sqlContent
      });

      return JSON.parse(result.data.toString('utf8'));
    }
  }
  return ErrorService;
};
