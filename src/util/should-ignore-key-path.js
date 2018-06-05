const memoize = require('lodash.memoize');

const cacheKeyResolver = (ignoreKeysList, keyPath) => {
  return `${ignoreKeysList}__${keyPath}`;
};

const shouldIgnoreKeyPath = (ignoreKeysList = [], keyPath) => {
  const serializedKeyPath = keyPath.join('.');
  return Array.isArray(ignoreKeysList) && ignoreKeysList.includes(serializedKeyPath);
};

module.exports = memoize(shouldIgnoreKeyPath, cacheKeyResolver);