/**
 * user service
 */

const util = require('../common/util');
const { PAGE_NUM } = require('../common/config');

// 查询需要的字段
const attributes = ['id', 'username', 'email', 'weixin', 'created_at', 'updated_at'];

module.exports = (app) => {
  class UserService extends app.Service {
    * createOne(data) {
      return yield this.ctx.model.User.create(data);
    }

    * findOne(params = {}) {
      return yield this.ctx.model.User.findOne({ attributes, where: params });
    }

    * findOneById(id) {
      return yield this.ctx.model.User.findOne({ where: { id } });
    }

    * findAndCountAll(where, offset, limit, order) {
      const defaultOrder = [['id', 'DESC']];

      // 如果第一个参数为布尔值，返回所有数据
      if (util.isBoolean(where)) {
        return yield this.ctx.model.User.findAndCountAll({
          attributes,
          order: defaultOrder
        });
      }

      if (!util.isObject(where)) {
        order = limit;
        limit = offset;
        offset = where || 0;
        where = {};
      }

      return yield this.ctx.model.User.findAndCountAll({
        attributes,
        where,
        offset,
        limit: limit || PAGE_NUM,
        order: order || defaultOrder
      });
    }

    * updateOneById(id, data) {
      try {
        yield this.ctx.model.User.update(data, { where: { id } });
        return data;
      } catch (e) {
        return e;
      }
    }

    * deleteOneById(id) {
      return yield this.ctx.model.User.destroy({ where: { id } });
    }
  }
  return UserService;
};
