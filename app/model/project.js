/**
 * project model
 */

module.exports = (app) => {
  const { STRING, INTEGER } = app.Sequelize;

  const Project = app.model.define('Project', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    pid: {
      type: STRING,
      comment: '产品ID',
      unique: true
    },
    title: {
      type: STRING,
      comment: '产品名称'
    },
    owner: {
      type: STRING,
      comment: '创建用户'
    }
  }, {
    tableName: 'project',
    comment: '项目表'
  });

  return Project;
};
