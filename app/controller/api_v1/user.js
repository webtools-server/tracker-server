/**
 * user控制器
 */

const util = require('../../common/util');
const { RET_CODE } = require('../../common/enum');
const { PAGE_NUM } = require('../../common/config');

module.exports = (app) => {
  class UserController extends app.Controller {
    /**
     * 创建记录
     */
    * createOne() {
      const ctx = this.ctx;
      const { username, password, email, weixin } = ctx.request.body;

      if (!username || !password || !email || !weixin) {
        ctx.body = { code: RET_CODE.ERROR, msg: '请填写完整' };
        return;
      }

      // 根据用户名查找记录
      const findResult = yield ctx.service.user.findOne({ username });
      // 如果有记录，不能重复创建
      if (findResult) {
        ctx.body = { code: RET_CODE.ERROR, msg: `用户${username}已经存在` };
        return;
      }

      // 创建
      const result = yield ctx.service.user.createOne({ username, email, weixin, password: util.md5(password) });
      if (!util.isError(result)) {
        ctx.body = {
          code: RET_CODE.OK,
          data: {
            id: result.id,
            username: result.username,
            email: result.email,
            weixin: result.weixin
          }
        };
      } else {
        ctx.body = { code: RET_CODE.ERROR, msg: result.toString() };
      }
    }

    /**
     * 查询一条记录
     */
    * queryOne() {
      const ctx = this.ctx;
      const id = ctx.params.id || '';
      const result = yield ctx.service.user.findOne({ id });
      ctx.body = result ? { code: RET_CODE.OK, data: result } : { code: RET_CODE.ERROR, msg: `${id}不存在` };
    }

    /**
     * 查询记录
     */
    * query() {
      const ctx = this.ctx;
      const page = parseInt(ctx.query.page, 10) || 1;
      const all = ctx.query.all || '';
      const username = ctx.query.username;

      // 如果all参数有值，返回所有数据
      if (all) {
        const result = yield ctx.service.user.findAndCountAll(!!all);

        ctx.body = {
          code: RET_CODE.OK,
          data: {
            total: result.count,
            list: result.rows
          }
        };
      } else {
        const result = yield ctx.service.user.findAndCountAll({
          username: { $like: `%${username}%` }
        }, (page - 1) * PAGE_NUM);

        ctx.body = {
          code: RET_CODE.OK,
          data: {
            total: result.count,
            currPage: page,
            pageSize: PAGE_NUM,
            list: result.rows
          }
        };
      }
    }

    /**
     * 删除记录
     */
    * deleteOne() {
      const ctx = this.ctx;
      const result = yield ctx.service.user.deleteOneById(ctx.params.id);
      ctx.body = { code: RET_CODE.OK, data: { rows: result } };
    }

    /**
     * 修改用户信息
     */
    * putOne() {
      const ctx = this.ctx;
      const { username, email, weixin } = ctx.request.body;

      // 检测提交参数
      if (!username || !email || !weixin) {
        ctx.body = { code: RET_CODE.ERROR, msg: '请填写完整' };
        return;
      }

      // 更新用户信息
      const result = yield ctx.service.user.updateOneById(
        ctx.params.id,
        { username, email, weixin }
      );

      if (!util.isError(result)) {
        ctx.body = {
          code: RET_CODE.OK,
          data: {
            id: result.id,
            username: result.username,
            email: result.email,
            weixin: result.weixin
          }
        };
      } else {
        ctx.body = {
          code: RET_CODE.ERROR,
          msg: result.toString()
        };
      }
    }

    /**
     * 修改密码
     */
    * changePwd() {
      const ctx = this.ctx;
      const { oldPassword, password } = ctx.request.body;

      // 检测提交参数
      if (!oldPassword || !password) {
        ctx.body = { code: RET_CODE.ERROR, msg: '请填写完整' };
        return;
      }

      // 查询记录
      const id = ctx.params.id;
      const record = yield ctx.service.user.findOneById(id);
      if (!record) {
        ctx.body = { code: RET_CODE.ERROR, msg: `没找到ID为${id}的用户` };
        return;
      }

      // 如果旧密码错误
      if (record.password !== util.md5(oldPassword)) {
        ctx.body = { code: RET_CODE.ERROR, msg: '原始密码错误' };
        return;
      }

      // 更新密码
      const result = yield ctx.service.user.updateOneById(id, {
        password: util.md5(password)
      });
      if (!util.isError(result)) {
        ctx.body = {
          code: RET_CODE.OK,
          data: {
            id: record.id,
            username: record.username
          }
        };
      } else {
        ctx.body = {
          code: RET_CODE.ERROR,
          msg: result.toString()
        };
      }
    }
  }
  return UserController;
};
