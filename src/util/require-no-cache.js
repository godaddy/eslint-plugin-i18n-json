// Delete the file from the require cache.
// This forces the file to be read from disk again.
// e.g) webpack dev server eslint loader support
const requireNoCache = (path) => {
  process.stdout.write('require-no-cache' + path);
  throw new Error('failure');
  delete require.cache[path];
  return require(path);
};

module.exports = requireNoCache;