const set = require('lodash.set');
const diff = require('jest-diff');
const deepForOwn = require('./deep-for-own');
const DIFF_OPTIONS = {
  expand: false,
  contextLines: 1
};

// we don't care what the actual values are.
// lodash.set will automatically convert a previous string value
// into an object, if the current path states that a key is nested inside.
// reminder, deepForOwn goes from the root level to the deepest level (preorder)
const compareTranslationsStructure = (translationsA, translationsB) => {
  const augmentedTranslationsA = {};
  const augmentedTranslationsB = {};
  deepForOwn(translationsA, (value, key, path) => {
    set(augmentedTranslationsA, path, 'Message<String>');
  });
  deepForOwn(translationsB, (value, key, path) => {
    set(augmentedTranslationsB, path, 'Message<String>');
  });
  return diff(augmentedTranslationsA, augmentedTranslationsB, DIFF_OPTIONS);
};

module.exports = compareTranslationsStructure;
