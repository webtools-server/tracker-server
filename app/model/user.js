/**
 * 用户model
 */

module.exports = (app) => {
  const { STRING, INTEGER, Op } = app.Sequelize;

  const User = app.model.define('User', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: STRING,
      comment: '用户名',
      unique: true
    },
    password: {
      type: STRING,
      comment: '密码'
    },
    email: {
      type: STRING,
      comment: '邮箱'
    },
    weixin: {
      type: STRING,
      comment: '微信ID'
    },
    is_admin: {
      type: INTEGER,
      comment: '是否管理员'
    }
  }, {
    tableName: 'user',
    comment: '用户表'
  });

  User.findAllByIds = function* (ids = []) {
    return yield this.findAll({
      where: {
        id: {
          [Op.in]: ids
        }
      }
    });
  };

  return User;
};
