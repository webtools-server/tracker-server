/**
 * api_v1控制器
 */

const { PAGE_NUM } = require('../common/config');
const { SQL_CONDITION_TYPE, TRACKER_TYPE, RET_CODE } = require('../common/enum');

module.exports = (app) => {
  class ApiV1Controller extends app.Controller {
    * query() {
      // ?page=1&timestamp=&platform=ios&pid=&network=&link=
      const ctx = this.ctx;
      const page = parseInt(ctx.query.page, 10) || 1;
      const whereObj = getConditionByQuery(ctx.query, [
        { name: 'platform', type: SQL_CONDITION_TYPE.LIKE },
        { name: 'pid', type: SQL_CONDITION_TYPE.NORMAL },
        { name: 'network', type: SQL_CONDITION_TYPE.LIKE },
        { name: 'link', type: SQL_CONDITION_TYPE.LIKE }
      ]);

      const sqlObj = {
        where: Object.assign({
          op_type: 'error',
          'op_params.t_type': TRACKER_TYPE.ERROR
        }, whereObj),
        order: [['op_params.timestamp', 'desc']],
        limit: PAGE_NUM,
        offset: (page - 1) * PAGE_NUM
      };

      // const jsondata = yield this.ctx.service.error.query(sqlObj);
      this.ctx.body = yield sleep();
      return;

      // 如果没有错误
      if (!jsondata.error) {
        this.ctx.body = {
          code: RET_CODE.OK,
          data: {
            total: jsondata.hits.total,
            currPage: page,
            pageSize: PAGE_NUM,
            list: jsondata.hits.hits.map(d => d._source.op_params)
          }
        };
      } else {
        this.ctx.body = {
          code: RET_CODE.ERROR,
          msg: jsondata.error.type
        };
      }
    }
  }
  return ApiV1Controller;
};

function sleep() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({"code":0,"data":{"total":8497,"currPage":1,"pageSize":10,"list":[{"platform":"ios","in_app":0,"cust_id":"","uniq_id":"g_tracker82607864457","source":"groupmessage","act_id":"","group":"","link":"https://cdn.jyblife.com/act/201709/invite/pages/register.html?tel=133****2872&custid=GAEHYBsvJX8=&coupon=10&coupon_name=%E9%80%9A%E7%94%A8%E5%88%B8&coupon_type=0&from=groupmessage&isappinstalled=0","ua":"Mozilla/5.0 (iPhone; CPU iPhone OS 10_2 like Mac OS X) AppleWebKit/602.3.12 (KHTML, like Gecko) Mobile/14C92 MicroMessenger/6.5.16 NetType/WIFI Language/zh_CN","title":"新用户专享三重礼","size":"375*603","referer":"","timestamp":1506486138770,"network":"","badjs":"1","pid":"act","t_type":"1","c1":"TypeError: i is not a function. (In 'i(o.status,o.responseText)', 'i' is undefined),1,30762","c2":"https://cdn.jyblife.com/act/201709/invite/js/register-d993cbb9.js","c3":"onreadystatechange@https://cdn.jyblife.com/act/201709/invite/js/register-d993cbb9.js:1:30762"},{"platform":"ios","in_app":0,"cust_id":"","uniq_id":"g_tracker82607864457","source":"groupmessage","act_id":"","group":"","link":"https://cdn.jyblife.com/act/201709/invite/pages/register.html?tel=133****2872&custid=GAEHYBsvJX8=&coupon=10&coupon_name=%E9%80%9A%E7%94%A8%E5%88%B8&coupon_type=0&from=groupmessage&isappinstalled=0","ua":"Mozilla/5.0 (iPhone; CPU iPhone OS 10_2 like Mac OS X) AppleWebKit/602.3.12 (KHTML, like Gecko) Mobile/14C92 MicroMessenger/6.5.16 NetType/WIFI Language/zh_CN","title":"新用户专享三重礼","size":"375*603","referer":"","timestamp":1506486138614,"network":"","badjs":"1","pid":"act","t_type":"1","c1":"TypeError: i is not a function. (In 'i(o.status,o.responseText)', 'i' is undefined),1,30762","c2":"https://cdn.jyblife.com/act/201709/invite/js/register-d993cbb9.js","c3":"onreadystatechange@https://cdn.jyblife.com/act/201709/invite/js/register-d993cbb9.js:1:30762\nopen@[native code]\ni@https://cdn.jyblife.com/act/201709/invite/js/register-d993cbb9.js:1:30795\nvalue@https://cdn.jyblife.com/act/201709/invite/js/register-d993cbb9.js:1:33127\ninit@https://cdn.jyblife.com/act/201709/invite/js/register-d993cbb9.js:1:34571\nhttps://cdn.jyblife.com/act/201709/invite/js/register-d993cbb9.js:1:42060\nhttps://cdn.jyblife.com/act/201709/invite/js/register-d993cbb9.js:1:42298\ne@https://cdn.jyblife.com/act/201709/invite/js/register-d993cbb9.js:1:105\nhttps://cdn.jyblife.com/act/201709/invite/js/register-d993cbb9.js:1:471\nglobal code@https://cdn.jyblife.com/act/201709/invite/js/register-d993cbb9.js:1:480"},{"platform":"ios","in_app":0,"cust_id":"","uniq_id":"g_tracker148518955292","source":"groupmessage","act_id":"","group":"","link":"https://cdn.jyblife.com/act/201709/invite/pages/register.html?tel=138****2191&custid=Gi85YBsvITQZEV54&coupon=10&coupon_name=%E9%80%9A%E7%94%A8%E5%88%B8&coupon_type=0&from=groupmessage&isappinstalled=1","ua":"Mozilla/5.0 (iPhone; CPU iPhone OS 10_2_1 like Mac OS X) AppleWebKit/602.4.6 (KHTML, like Gecko) Mobile/14D27 MicroMessenger/6.5.1 NetType/WIFI Language/zh_CN","title":"新用户专享三重礼","size":"375*603","referer":"","timestamp":1506481189331,"network":"","badjs":"1","pid":"act","t_type":"1","c1":"ReferenceError: Can't find variable: _WXJS,1,9","c2":"https://cdn.jyblife.com/act/201709/invite/pages/register.html?tel=138****2191&custid=Gi85YBsvITQZEV54&coupon=10&coupon_name=%E9%80%9A%E7%94%A8%E5%88%B8&coupon_type=0&from=groupmessage&isappinstalled=1","c3":"global code@https://cdn.jyblife.com/act/201709/invite/pages/register.html?tel=138****2191&custid=Gi85YBsvITQZEV54&coupon=10&coupon_name=%E9%80%9A%E7%94%A8%E5%88%B8&coupon_type=0&from=groupmessage&isappinstalled=1:1:9\ninsertBefore@[native code]\nvalue@https://cdn.jyblife.com/act/201709/invite/js/register-e618ee64.js:1:18335\nhttps://cdn.jyblife.com/act/201709/invite/js/register-e618ee64.js:1:21024\nhttps://cdn.jyblife.com/act/201709/invite/js/register-e618ee64.js:1:14731\nforEach@[native code]\nr@https://cdn.jyblife.com/act/201709/invite/js/register-e618ee64.js:1:14712\nvalue@https://cdn.jyblife.com/act/201709/invite/js/register-e618ee64.js:1:20886\nvalue@https://cdn.jyblife.com/act/201709/invite/js/register-e618ee64.js:1:20355\nhttps://cdn.jyblife.com/act/201709/invite/js/register-e618ee64.js:1:6413\ne@https://cdn.jyblife.com/act/201709/invite/js/register-e618ee64.js:1:105\nhttps://cdn.jyblife.com/act/201709/invite/js/register-e618ee64.js:1:41981\ne@https://cdn.jyblife.com/act/201709/invite/js/register-e618ee64.js:1:105\nhttps://cdn.jyblife.com/act/201709/invite/js/register-e618ee64.js:1:471\nglobal code@https://cdn.jyblife.com/act/201709/invite/js/register-e618ee64.js:1:480"},{"platform":"ios","in_app":0,"cust_id":"","uniq_id":"g_tracker148518955292","source":"groupmessage","act_id":"","group":"","link":"https://cdn.jyblife.com/act/201709/invite/pages/register.html?tel=138****2191&custid=Gi85YBsvITQZEV54&coupon=10&coupon_name=%E9%80%9A%E7%94%A8%E5%88%B8&coupon_type=0&from=groupmessage&isappinstalled=1","ua":"Mozilla/5.0 (iPhone; CPU iPhone OS 10_2_1 like Mac OS X) AppleWebKit/602.4.6 (KHTML, like Gecko) Mobile/14D27 MicroMessenger/6.5.1 NetType/WIFI Language/zh_CN","title":"新用户专享三重礼","size":"375*603","referer":"","timestamp":1506481189325,"network":"","badjs":"1","pid":"act","t_type":"1","c1":"ReferenceError: Can't find variable: _WXJS,1,9","c2":"https://cdn.jyblife.com/act/201709/invite/pages/register.html?tel=138****2191&custid=Gi85YBsvITQZEV54&coupon=10&coupon_name=%E9%80%9A%E7%94%A8%E5%88%B8&coupon_type=0&from=groupmessage&isappinstalled=1","c3":"global code@https://cdn.jyblife.com/act/201709/invite/pages/register.html?tel=138****2191&custid=Gi85YBsvITQZEV54&coupon=10&coupon_name=%E9%80%9A%E7%94%A8%E5%88%B8&coupon_type=0&from=groupmessage&isappinstalled=1:1:9\ninsertBefore@[native code]\nvalue@https://cdn.jyblife.com/act/201709/invite/js/register-e618ee64.js:1:18335\nhttps://cdn.jyblife.com/act/201709/invite/js/register-e618ee64.js:1:21024\nhttps://cdn.jyblife.com/act/201709/invite/js/register-e618ee64.js:1:14731\nforEach@[native code]\nr@https://cdn.jyblife.com/act/201709/invite/js/register-e618ee64.js:1:14712\nvalue@https://cdn.jyblife.com/act/201709/invite/js/register-e618ee64.js:1:20886\nvalue@https://cdn.jyblife.com/act/201709/invite/js/register-e618ee64.js:1:20355\nhttps://cdn.jyblife.com/act/201709/invite/js/register-e618ee64.js:1:6413\ne@https://cdn.jyblife.com/act/201709/invite/js/register-e618ee64.js:1:105\nhttps://cdn.jyblife.com/act/201709/invite/js/register-e618ee64.js:1:41981\ne@https://cdn.jyblife.com/act/201709/invite/js/register-e618ee64.js:1:105\nhttps://cdn.jyblife.com/act/201709/invite/js/register-e618ee64.js:1:471\nglobal code@https://cdn.jyblife.com/act/201709/invite/js/register-e618ee64.js:1:480"},{"platform":"ios","in_app":0,"cust_id":"","uniq_id":"g_tracker198350961159","source":"","act_id":"","group":"","link":"https://cdn.jyblife.com/act/201709/invite/pages/index.html?mta_id=30018.1.3","ua":"Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_3 like Mac OS X) AppleWebKit/603.3.8 (KHTML, like Gecko) Mobile/14G60 MicroMessenger/6.5.17 NetType/WIFI Language/zh_CN","title":"好友邀请三重礼","size":"375*603","referer":"","timestamp":1506466205398,"network":"","badjs":"1","pid":"act","t_type":"1","c1":"TypeError: i is not a function. (In 'i(o.status,o.responseText)', 'i' is undefined),1,30762","c2":"https://cdn.jyblife.com/act/201709/invite/js/index-8ebd20af.js","c3":"onreadystatechange@https://cdn.jyblife.com/act/201709/invite/js/index-8ebd20af.js:1:30762"},{"platform":"ios","in_app":0,"cust_id":"","uniq_id":"g_tracker198350961159","source":"","act_id":"","group":"","link":"https://cdn.jyblife.com/act/201709/invite/pages/index.html?mta_id=30018.1.3","ua":"Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_3 like Mac OS X) AppleWebKit/603.3.8 (KHTML, like Gecko) Mobile/14G60 MicroMessenger/6.5.17 NetType/WIFI Language/zh_CN","title":"好友邀请三重礼","size":"375*603","referer":"","timestamp":1506466205397,"network":"","badjs":"1","pid":"act","t_type":"1","c1":"TypeError: i is not a function. (In 'i(o.status,o.responseText)', 'i' is undefined),1,30762","c2":"https://cdn.jyblife.com/act/201709/invite/js/index-8ebd20af.js","c3":"onreadystatechange@https://cdn.jyblife.com/act/201709/invite/js/index-8ebd20af.js:1:30762"},{"platform":"ios","in_app":0,"cust_id":"","uniq_id":"g_tracker198350961159","source":"","act_id":"","group":"","link":"https://cdn.jyblife.com/act/201709/invite/pages/index.html?mta_id=30018.1.3","ua":"Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_3 like Mac OS X) AppleWebKit/603.3.8 (KHTML, like Gecko) Mobile/14G60 MicroMessenger/6.5.17 NetType/WIFI Language/zh_CN","title":"好友邀请三重礼","size":"375*603","referer":"","timestamp":1506466204854,"network":"","badjs":"1","pid":"act","t_type":"1","c1":"TypeError: i is not a function. (In 'i(o.status,o.responseText)', 'i' is undefined),1,30762","c2":"https://cdn.jyblife.com/act/201709/invite/js/index-8ebd20af.js","c3":"onreadystatechange@https://cdn.jyblife.com/act/201709/invite/js/index-8ebd20af.js:1:30762\nopen@[native code]\ni@https://cdn.jyblife.com/act/201709/invite/js/index-8ebd20af.js:1:30795\nvalue@https://cdn.jyblife.com/act/201709/invite/js/index-8ebd20af.js:1:33127\ninit@https://cdn.jyblife.com/act/201709/invite/js/index-8ebd20af.js:1:34571\nhttps://cdn.jyblife.com/act/201709/invite/js/index-8ebd20af.js:1:43986\ne@https://cdn.jyblife.com/act/201709/invite/js/index-8ebd20af.js:1:105\nhttps://cdn.jyblife.com/act/201709/invite/js/index-8ebd20af.js:1:471\nglobal code@https://cdn.jyblife.com/act/201709/invite/js/index-8ebd20af.js:1:480"},{"platform":"ios","in_app":0,"cust_id":"22567095","uniq_id":"22567095","source":"","act_id":"","group":"","link":"https://cdn.jyblife.com/act/201709/invite/pages/index.html?mta_id=30018.1.3","ua":"Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_3 like Mac OS X) AppleWebKit/603.3.8 (KHTML, like Gecko) Mobile/14G60 MicroMessenger/6.5.16 NetType/WIFI Language/zh_CN","title":"好友邀请三重礼","size":"414*672","referer":"","timestamp":1506460303112,"network":"","badjs":"1","pid":"act","t_type":"1","c1":"TypeError: i is not a function. (In 'i(o.status,o.responseText)', 'i' is undefined),1,30762","c2":"https://cdn.jyblife.com/act/201709/invite/js/index-8ebd20af.js","c3":"onreadystatechange@https://cdn.jyblife.com/act/201709/invite/js/index-8ebd20af.js:1:30762"},{"platform":"ios","in_app":0,"cust_id":"22567095","uniq_id":"22567095","source":"","act_id":"","group":"","link":"https://cdn.jyblife.com/act/201709/invite/pages/index.html?mta_id=30018.1.3","ua":"Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_3 like Mac OS X) AppleWebKit/603.3.8 (KHTML, like Gecko) Mobile/14G60 MicroMessenger/6.5.16 NetType/WIFI Language/zh_CN","title":"好友邀请三重礼","size":"414*672","referer":"","timestamp":1506460303111,"network":"","badjs":"1","pid":"act","t_type":"1","c1":"TypeError: i is not a function. (In 'i(o.status,o.responseText)', 'i' is undefined),1,30762","c2":"https://cdn.jyblife.com/act/201709/invite/js/index-8ebd20af.js","c3":"onreadystatechange@https://cdn.jyblife.com/act/201709/invite/js/index-8ebd20af.js:1:30762"},{"platform":"ios","in_app":0,"cust_id":"22567095","uniq_id":"22567095","source":"","act_id":"","group":"","link":"https://cdn.jyblife.com/act/201709/invite/pages/index.html?mta_id=30018.1.3","ua":"Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_3 like Mac OS X) AppleWebKit/603.3.8 (KHTML, like Gecko) Mobile/14G60 MicroMessenger/6.5.16 NetType/WIFI Language/zh_CN","title":"好友邀请三重礼","size":"414*672","referer":"","timestamp":1506460302912,"network":"","badjs":"1","pid":"act","t_type":"1","c1":"TypeError: i is not a function. (In 'i(o.status,o.responseText)', 'i' is undefined),1,30762","c2":"https://cdn.jyblife.com/act/201709/invite/js/index-8ebd20af.js","c3":"onreadystatechange@https://cdn.jyblife.com/act/201709/invite/js/index-8ebd20af.js:1:30762\nopen@[native code]\ni@https://cdn.jyblife.com/act/201709/invite/js/index-8ebd20af.js:1:30795\nvalue@https://cdn.jyblife.com/act/201709/invite/js/index-8ebd20af.js:1:33127\ninit@https://cdn.jyblife.com/act/201709/invite/js/index-8ebd20af.js:1:34571\nhttps://cdn.jyblife.com/act/201709/invite/js/index-8ebd20af.js:1:43986\ne@https://cdn.jyblife.com/act/201709/invite/js/index-8ebd20af.js:1:105\nhttps://cdn.jyblife.com/act/201709/invite/js/index-8ebd20af.js:1:471\nglobal code@https://cdn.jyblife.com/act/201709/invite/js/index-8ebd20af.js:1:480"}]}}    );
    }, 1000);
  });
}

/**
 * 根据传参获取查询条件
 * @param {Object} query
 * @param {Array} fields [{name: 'platform', type: 1}]
 */
function getConditionByQuery(query, fields) {
  return fields.reduce((objs, field) => {
    const currentField = query[field.name];

    if (currentField) {
      switch (field.type) {
        case SQL_CONDITION_TYPE.NORMAL:
          objs[`op_params.${field.name}`] = currentField;
          break;
        case SQL_CONDITION_TYPE.LIKE:
          objs[`op_params.${field.name}`] = { $like: `%${currentField}%` };
          break;
        default:
          break;
      }
    }
    return objs;
  }, {});
}

