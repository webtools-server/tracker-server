/**
 * 默认规则控制器
 */

const util = require('../../common/util');
const { RET_CODE } = require('../../common/enum');

module.exports = (app) => {
  class DefaultRuleController extends app.Controller {
    /**
     * 检查body字段
     */
    checkBodyFields() {
      const reqBody = this.ctx.request.body;
      // 验证规则
      const validateRule = {
        type: {
          required: true,
          type: 'string'
        },
        title: {
          required: true,
          type: 'string'
        },
        fieldName: {
          required: true,
          type: 'string'
        },
        fieldAction: {
          required: true,
          type: 'string'
        },
        fieldValue: {
          required: true,
          type: 'string'
        },
        statType: {
          required: true,
          type: 'string'
        },
        statAction: {
          required: true,
          type: 'string'
        },
        statValue: {
          required: true,
          type: 'string'
        }
      };
      return this.app.validator.validate(validateRule, reqBody);
    }

    * query() {
      const ctx = this.ctx;
      const result = yield ctx.service.defaultRule.findAll();
      ctx.body = {
        code: RET_CODE.OK,
        data: result
      };
    }

    /**
     * 创建记录
     */
    * createOne() {
      const ctx = this.ctx;
      const reqBody = ctx.request.body;
      const validResult = this.checkBodyFields();
      if (validResult) {
        ctx.body = validResult;
        return;
      }

      // 创建
      const result = yield ctx.service.defaultRule.createOne({
        type: reqBody.type,
        title: reqBody.title,
        minutes: reqBody.minutes,
        field_name: reqBody.fieldName,
        field_action: reqBody.fieldAction,
        field_value: reqBody.fieldValue,
        stat_type: reqBody.statType,
        stat_action: reqBody.statAction,
        stat_value: reqBody.statValue
      });
      if (!util.isError(result)) {
        ctx.body = { code: RET_CODE.OK, data: result };
      } else {
        ctx.body = { code: RET_CODE.ERROR, msg: result.toString() };
      }
    }

    /**
     * 修改规则
     */
    * putOne() {
      const ctx = this.ctx;
      const reqBody = ctx.request.body;
      const validResult = this.checkBodyFields();

      if (validResult) {
        ctx.body = validResult;
        return;
      }

      // 更新用户信息
      const result = yield ctx.service.defaultRule.updateOneById(
        ctx.params.id,
        {
          type: reqBody.type,
          title: reqBody.title,
          minutes: reqBody.minutes,
          field_name: reqBody.fieldName,
          field_action: reqBody.fieldAction,
          field_value: reqBody.fieldValue,
          stat_type: reqBody.statType,
          stat_action: reqBody.statAction,
          stat_value: reqBody.statValue
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
     * 删除记录
     */
    * deleteOne() {
      const ctx = this.ctx;
      const result = yield ctx.service.defaultRule.deleteOneById(ctx.params.id);
      ctx.body = { code: RET_CODE.OK, data: { rows: result } };
    }
  }
  return DefaultRuleController;
};
