/**
 * 告警规则控制器
 */

const util = require('../../common/util');
const { RET_CODE } = require('../../common/enum');

module.exports = (app) => {
  class AlertRuleController extends app.Controller {
    /**
     * 检查body字段
     * @param {Array} fields
     */
    checkBodyFields(fields) {
      const ctx = this.ctx;
      const bodyFields = {};
      let checkSuccess = true;

      fields.forEach((field) => {
        const current = ctx.request.body[field];
        if (current === undefined) {
          checkSuccess = false;
        }
        bodyFields[field] = current;
      });

      return {
        checkSuccess,
        bodyFields
      };
    }

    /**
     * 创建记录
     */
    * createOne() {
      const ctx = this.ctx;
      const { checkSuccess, bodyFields } = this.checkBodyFields([
        'pid',
        'type',
        'title',
        'minutes',
        'fieldName',
        'fieldAction',
        'fieldValue',
        'statType',
        'statAction',
        'statValue'
      ]);

      // 检测字段
      if (!checkSuccess) {
        ctx.body = { code: RET_CODE.ERROR, msg: '请填写完整' };
        return;
      }

      // 项目是否存在
      const findResult = yield ctx.service.project.findOneByPid(bodyFields.pid);
      // 如果没有记录
      if (!findResult) {
        ctx.body = { code: RET_CODE.ERROR, msg: `项目${bodyFields.pid}不存在` };
        return;
      }

      // 创建
      const result = yield ctx.service.alertRule.createOne({
        pid: bodyFields.pid,
        type: bodyFields.type,
        title: bodyFields.title,
        minutes: bodyFields.minutes,
        field_name: bodyFields.fieldName,
        field_action: bodyFields.fieldAction,
        field_value: bodyFields.fieldValue,
        stat_type: bodyFields.statType,
        stat_action: bodyFields.statAction,
        stat_value: bodyFields.statValue
      });
      if (!util.isError(result)) {
        ctx.body = { code: RET_CODE.OK, data: result };
      } else {
        ctx.body = { code: RET_CODE.ERROR, msg: result.toString() };
      }
    }

    /**
     * 修改告警规则
     */
    * putOne() {
      const ctx = this.ctx;
      const { checkSuccess, bodyFields } = this.checkBodyFields([
        'type',
        'title',
        'minutes',
        'fieldName',
        'fieldAction',
        'fieldValue',
        'statType',
        'statAction',
        'statValue'
      ]);

      // 检测字段
      if (!checkSuccess) {
        ctx.body = { code: RET_CODE.ERROR, msg: '请填写完整' };
        return;
      }

      // 更新用户信息
      const result = yield ctx.service.alertRule.updateOneById(
        ctx.params.id,
        {
          type: bodyFields.type,
          title: bodyFields.title,
          minutes: bodyFields.minutes,
          field_name: bodyFields.fieldName,
          field_action: bodyFields.fieldAction,
          field_value: bodyFields.fieldValue,
          stat_type: bodyFields.statType,
          stat_action: bodyFields.statAction,
          stat_value: bodyFields.statValue
        }
      );

      if (!util.isError(result)) {
        ctx.body = {
          code: RET_CODE.OK,
          data: { id: result.id }
        };
      } else {
        ctx.body = {
          code: RET_CODE.ERROR,
          msg: result.toString()
        };
      }
    }

    /**
     * 通过产品ID查询记录
     */
    * queryByPid() {
      const ctx = this.ctx;
      const result = yield ctx.service.alertRule.findAll({
        pid: ctx.params.pid || ''
      });
      ctx.body = {
        code: RET_CODE.OK,
        data: result
      };
    }

    /**
     * 删除记录
     */
    * deleteOne() {
      const ctx = this.ctx;
      const result = yield ctx.service.alertRule.deleteOneById(ctx.params.id);
      ctx.body = { code: RET_CODE.OK, data: { rows: result } };
    }
  }
  return AlertRuleController;
};
