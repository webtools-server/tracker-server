/**
 * field控制器
 */

const fields = require('../../data/field');
const actions = require('../../data/action');

module.exports = (app) => {
  class FieldController extends app.Controller {
    getFields() {
      this.ctx.body = {
        fields,
        actions
      };
    }

    * ceshi() {
      this.ctx.body = yield this.ctx.service.alert.calcAlertRule();
    }
  }
  return FieldController;
};
