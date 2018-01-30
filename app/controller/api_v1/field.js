/**
 * field控制器
 */

const dataField = require('../../data/field');
const dataAction = require('../../data/action');
const dataType = require('../../data/type');
const {
  RET_CODE,
  TRACKER_TYPE
} = require('../../common/enum');

module.exports = (app) => {
  class FieldController extends app.Controller {
    * calcAlertRule() {
      const reuslt = yield this.ctx.service.alert.calcAlertRule();
      this.ctx.body = reuslt;
    }

    * getFieldsData() {
      this.ctx.body = {
        code: RET_CODE.OK,
        data: {
          error: yield this.queryData(TRACKER_TYPE.ERROR),
          api: yield this.queryData(TRACKER_TYPE.API),
          perf: yield this.queryData(TRACKER_TYPE.PERF)
        }
      };
    }

    * queryData(type) {
      const ctx = this.ctx;
      const sqlObj = {
        where: [
          ['op_type', 'error'],
          ['op_params.t_type', type]
        ],
        order: [['@timestamp', 'desc']],
        limit: 1
      };

      let queryResult = {};
      let queryData = {};

      switch (type) {
        case TRACKER_TYPE.ERROR:
          queryResult = yield ctx.service.error.query(sqlObj);
          break;
        case TRACKER_TYPE.API:
          queryResult = yield ctx.service.api.query(sqlObj);
          break;
        case TRACKER_TYPE.PERF:
          queryResult = yield ctx.service.perf.query(sqlObj);
          break;
        default:
          queryResult = {};
          break;
      }

      if (!queryResult.error) {
        queryData = queryResult.list[0] || {};
      }
      return queryData;
    }

    getFields() {
      const ctx = this.ctx;
      const type = ctx.params.type;
      let bodyContent = {};

      switch (type) {
        case 'field':
          bodyContent = dataField.fieldObj;
          break;
        case 'action':
          bodyContent = dataAction.actionObj;
          break;
        case 'type':
          bodyContent = {
            ruleType: dataType.ruleType,
            statType: dataType.statType
          };
          break;
        default:
          bodyContent = {
            field: dataField.fieldObj,
            action: dataAction.actionObj,
            type: {
              ruleType: dataType.ruleType,
              statType: dataType.statType
            }
          };
          break;
      }
      this.ctx.body = {
        code: RET_CODE.OK,
        data: bodyContent
      };
    }
  }
  return FieldController;
};
