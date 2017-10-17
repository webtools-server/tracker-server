/**
 * user model
 */

module.exports = (app) => {
  const { STRING, INTEGER } = app.Sequelize;

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
    }
  }, {
    tableName: 'user',
    comment: '用户表'
  });

  return User;
};
