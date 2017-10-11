/**
 * helper
 */

// 采集数据类型
const TRACKER_TYPE = {
  ERROR: '1',
  API: '2',
  PERF: '3'
};

function getTrackerType(str) {
  switch (str) {
    case 'error':
      return TRACKER_TYPE.ERROR;
    case 'api':
      return TRACKER_TYPE.API;
    case 'perf':
      return TRACKER_TYPE.PERF;
    default:
      return '';
  }
}

export default {
  getTrackerType
};
