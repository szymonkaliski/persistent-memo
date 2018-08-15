const { generateKey, Cache } = require("./persistence");

const cache = new Cache("persistent_cache_sync");

module.exports = fn => {
  const memoized = (...args) => {
    const key = generateKey(fn, args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn(...args);

    cache.set(key, result);

    return result;
  };

  return memoized;
};

module.exports.cache = cache;
