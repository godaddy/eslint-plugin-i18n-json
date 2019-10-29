const path = require('path');

const isJSONFile = sourceFilePath => {
  return path.extname(sourceFilePath) === '.json';
};

const INVALID_FILE_SOURCE = {
  source: null,
  sourceFilePath: null
};

const PLUGIN_HEADER = 'eslint-plugin-i18n-json';

// map out flow of json files and non json files.

/*
  PROJECT:
    json files -> preprocessed
    non json files -> not preprocessed

    need to be able to distinguish b/w them. 

*/

module.exports = node => {
  if (!Array.isArray(node.comments) || node.comments.length !== 3) {
    return INVALID_FILE_SOURCE;
  }

  const { value: pluginHeader } = node.comments[0];
  const { value: source } = node.comments[1];
  const { value: sourceFilePath } = node.comments[2];

  if (pluginHeader !== PLUGIN_HEADER) {
    return INVALID_FILE_SOURCE;
  }

  if (!isJSONFile(sourceFilePath)) {
    return INVALID_FILE_SOURCE;
  }

  return {
    source,
    sourceFilePath
  };
};
