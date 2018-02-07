const set = require('lodash.set');
const equal = require('lodash.isequal');
const isPlainObject = require('lodash.isplainobject');
const deepForOwn = require('./util/deep-for-own');

const ascTraversal = {
  keyTraversal: obj => Object.keys(obj).sort(),
};

const sortTranslations = (source) => {
  let translations = null;
  try {
    translations = JSON.parse(source);
  } catch (e) {
    // ignore errors, this will
    // be caught by the i18n-json/valid-json rule
    return [];
  }

  const sortedTranslations = {};
  const sortedTranslationPaths = [];

  deepForOwn(translations, (value, key, path) => {
    // if plain object, stub in a clean one to then get filled.
    set(sortedTranslations, path, isPlainObject(value) ? {} : value);
    sortedTranslationPaths.push(path);
  }, ascTraversal);

  // only need to fix if the order of the keys are not the same
  const originalTranslationPaths = [];
  deepForOwn(translations, (value, key, path) => {
    originalTranslationPaths.push(path);
  });

  if (!equal(originalTranslationPaths, sortedTranslationPaths)) {
    return [{
      fix: {
        range: [0, source.length],
        text: JSON.stringify(sortedTranslations, null, 2),
      },
      line: 0,
      column: 0,
    }];
  }
  // no errors
  return [];
};

module.exports = sortTranslations;
