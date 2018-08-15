const { generateKey, Cache } = require("./persistence");

const cache = new Cache("persistent_cache_async");

module.exports = async fn => {
  const memoized = async (...args) => {
    const key = generateKey(fn, args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = await fn(...args);

    cache.set(key, result);

    return result;
  };

  return memoized;
};

module.exports.cache = cache;
