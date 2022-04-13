/* eslint-disable global-require */

module.exports = {
  rules: {
    'valid-json': require('./src/valid-json'),
    'valid-message-syntax': require('./src/valid-message-syntax'),
    'identical-keys': require('./src/identical-keys'),
    'sorted-keys': require('./src/sorted-keys'),
    'identical-placeholders': require('./src/identical-placeholders')
  },
  processors: {
    '.json': {
      preprocess: (source, filePath) =>
        // augment the json into a comment
        // along with the source path :D
        // so we can pass it to the rules

        // note: due to the spaced comment rule, include
        // spaced comments
        [`/* ${source.trim()} *//* ${filePath.trim()} */\n`],
      // since we only return one line in the preprocess step,
      // we only care about the first array of errors
      postprocess: ([errors]) => [...errors],
      supportsAutofix: true
    }
  },
  configs: {
    recommended: {
      plugins: ['i18n-json'],
      rules: {
        'i18n-json/valid-message-syntax': [
          2,
          {
            syntax: 'icu' // default syntax
          }
        ],
        'i18n-json/valid-json': 2,
        'i18n-json/sorted-keys': [
          2,
          {
            order: 'asc',
            indentSpaces: 2
          }
        ],
        'i18n-json/identical-keys': 0,
        'i18n-json/identical-placeholders': 0
      }
    }
  }
};
