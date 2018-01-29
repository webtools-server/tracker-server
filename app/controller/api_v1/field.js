/**
 * field控制器
 */

const dataField = require('../../data/field');
const dataAction = require('../../data/action');
const dataType = require('../../data/type');
const {
  RET_CODE
} = require('../../common/enum');

module.exports = (app) => {
  class FieldController extends app.Controller {
    getFields() {
      const ctx = this.ctx;
      const type = ctx.params.type;
      let bodyContent = {};

      switch (type) {
        case 'field':
          bodyContent = dataField;
          break;
        case 'action':
          bodyContent = dataAction.actionObj;
          break;
        case 'type':
          bodyContent = dataType;
          break;
        default:
          bodyContent = {
            field: dataField,
            action: dataAction.actionObj,
            type: dataType
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
