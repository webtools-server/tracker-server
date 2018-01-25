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
    api_threshold: {
      type: INTEGER,
      comment: '超时响应时间'
    },
    slow_response_time: {
      type: INTEGER,
      comment: '最慢响应时间'
    },
    title: {
      type: STRING,
      comment: '产品名称'
    },
    owner: {
      type: STRING,
      comment: '创建用户'
    },
    alert_user: {
      type: STRING,
      comment: '告警用户ID列表'
    }
  }, {
    tableName: 'project',
    comment: '项目表'
  });

  return Project;
};
