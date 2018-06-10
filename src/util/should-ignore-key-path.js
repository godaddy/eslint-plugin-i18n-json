const shouldIgnoreKeyPath = (settings, keyPath) => {
  const ignoreKeysList = settings && settings['i18n-json/ignore-keys']
  const serializedKeyPath = keyPath.join('.');
  return Array.isArray(ignoreKeysList) && ignoreKeysList.includes(serializedKeyPath);
};

module.exports = shouldIgnoreKeyPath;