/**
 * 默认规则service
 */

module.exports = (app) => {
  class DefaultRuleService extends app.Service {
    * createOne(data) {
      return yield this.ctx.model.DefaultRule.create(data);
    }

    * findAll(where) {
      return yield this.ctx.model.DefaultRule.findAll({
        where,
        order: [['id', 'DESC']]
      });
    }

    * findById(id) {
      if (!Array.isArray(id)) {
        id = [id];
      }
      return yield this.ctx.model.DefaultRule.findAll({
        where: {
          id: {
            $in: id
          }
        }
      });
    }

    * updateOneById(id, data) {
      try {
        yield this.ctx.model.DefaultRule.update(data, { where: { id } });
        return data;
      } catch (e) {
        return e;
      }
    }

    * deleteOneById(id) {
      return yield this.ctx.model.DefaultRule.destroy({ where: { id } });
    }
  }
  return DefaultRuleService;
};
