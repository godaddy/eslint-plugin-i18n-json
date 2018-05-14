const set = require('lodash.set');
const diff = require('jest-diff');
const deepForOwn = require('./deep-for-own');

const DIFF_OPTIONS = {
  expand: false,
  contextLines: 1,
};

// we don't care what the actual values are.
// lodash.set will automatically convert a previous string value
// into an object, if the current path states that a key is nested inside.
// reminder, deepForOwn goes from the root level to the deepest level (preorder)

// ignoreKeys takes a key path which should be ignored when comparing translation files
const shouldIgnoreKeyPath = (ignoreKeys) => (keyPathSplit) => {
  const keyPath = keyPathSplit.join('.');
  return ignoreKeys.reduce((result, currentIgnoreKey) => {
    return (keyPath === currentIgnoreKey) || result;
  }, false);
};

const compareTranslationsStructure = (translationsA, translationsB, ignoreKeys) => {

  const augmentedTranslationsA = {};
  const augmentedTranslationsB = {};
  
  const shouldIgnore = shouldIgnoreKeyPath(ignoreKeys);

  deepForOwn(translationsA, (value, key, path) => {
    if(!shouldIgnore(path, ignoreKeys)){
      set(augmentedTranslationsA, path, 'Message<String>'); 
    }
  });

  deepForOwn(translationsB, (value, key, path) => {
    if(!shouldIgnore(path, ignoreKeys)){
      set(augmentedTranslationsB, path, 'Message<String>'); 
    }
  });

  return diff(augmentedTranslationsA, augmentedTranslationsB, DIFF_OPTIONS);
};

module.exports = compareTranslationsStructure;
