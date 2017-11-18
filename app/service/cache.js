/**
 * 缓存service
 */

const LRU = require('lru-cache');

const DEFAULT_MAX_AGE = 1000 * 60 * 30; // 缓存30分钟
const cache = new LRU({
  max: 500,
  length(n) {
    console.log(n);
    return n.length;
  },
  maxAge: DEFAULT_MAX_AGE
});

module.exports = (app) => {
  class CacheService extends app.Service {
    static set(key, value, maxAge = DEFAULT_MAX_AGE) {
      return cache.set(key, value, maxAge);
    }
    static get(key) {
      return cache.get(key);
    }
    static del(key) {
      return cache.del(key);
    }
    static has(key) {
      return cache.has(key);
    }
  }
  return CacheService;
};

