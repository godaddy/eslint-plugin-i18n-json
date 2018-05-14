/* eslint-disable global-require */

const translationFiles = {};

module.exports = {
  rules: {
    'valid-json': require('./src/valid-json'),
    'valid-message-syntax': require('./src/valid-message-syntax'),
    'identical-keys': require('./src/identical-keys'),
    'sorted-keys': require('./src/sorted-keys'),
  },
  processors: {
    '.json': {
      preprocess: (source, filePath) => {
        translationFiles[filePath] = source;
        // augment the json into a comment
        // along with the source path :D
        // so we can pass it to the rules
        return [
          `/* ${source.trim()} *//* ${filePath} */\n`,
        ];
      },
      // since we only return one line in the preprocess step,
      // we only care about the first array of errors
      postprocess: ([errors], filePath) => {
        // delete global reference
        // in order to prevent a large memory build up
        // during the life of the eslint process.
        delete translationFiles[filePath];

        return [
          ...errors,
        ];
      },
      supportsAutofix: true,
    },
  },
  configs: {
    recommended: {
      plugins: [
        'i18n-json',
      ],
      rules: {
        'i18n-json/valid-message-syntax': [2, {
          syntax: 'icu',
        }],
        'i18n-json/valid-json': 2,
        'i18n-json/sorted-keys': [2, {
          order: 'asc',
          indentSpaces: 2,
        }],
        'i18n-json/identical-keys': 0,
      },
    },
  },
};
