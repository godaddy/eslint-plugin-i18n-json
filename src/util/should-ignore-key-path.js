const shouldIgnoreKeyPath = (ignoreKeysList = [], keyPath) => {
  const serializedKeyPath = keyPath.join('.');
  return Array.isArray(ignoreKeysList) && ignoreKeysList.includes(serializedKeyPath);
};

module.exports = shouldIgnoreKeyPath;