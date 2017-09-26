/**
 * api_v1控制器
 */

const { PAGE_NUM } = require('../common/config');
const { SQL_CONDITION_TYPE, TRACKER_TYPE } = require('../common/enum');

module.exports = (app) => {
  class ApiV1Controller extends app.Controller {
    * query() {
      // ?page=1&timestamp=&platform=ios&pid=&network=&link=
      const ctx = this.ctx;
      const page = parseInt(ctx.query.page, 10) || 1;
      const whereObj = getConditionByQuery(ctx.query, [
        { name: 'platform', type: SQL_CONDITION_TYPE.LIKE },
        { name: 'pid', type: SQL_CONDITION_TYPE.NORMAL },
        { name: 'network', type: SQL_CONDITION_TYPE.LIKE },
        { name: 'link', type: SQL_CONDITION_TYPE.LIKE }
      ]);

      const sqlObj = {
        where: Object.assign({
          op_type: 'error',
          'op_params.t_type': TRACKER_TYPE.ERROR
        }, whereObj),
        order: [['op_params.timestamp', 'desc']],
        limit: PAGE_NUM,
        offset: (page - 1) * PAGE_NUM
      };

      this.ctx.body = yield this.ctx.service.error.query(sqlObj);
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
  return fields.reduce((objs, field) => {
    const currentField = query[field.name];

    if (currentField) {
      switch (field.type) {
        case SQL_CONDITION_TYPE.NORMAL:
          objs[`op_params.${field.name}`] = currentField;
          break;
        case SQL_CONDITION_TYPE.LIKE:
          objs[`op_params.${field.name}`] = { $like: `%${currentField}%` };
          break;
        default:
          break;
      }
    }
    return objs;
  }, {});
}

