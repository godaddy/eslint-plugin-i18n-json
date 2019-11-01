const path = require('path');

const isJSONFile = context => {
  return path.extname(context.getFilename()) === '.json';
};

const INVALID_SOURCE = {
  valid: false,
  source: null,
  sourceFilePath: null
};

// map out flow of json files and non json files.

/*
  PROJECT:
    json files -> preprocessed
    non json files -> not preprocessed

    need to be able to distinguish b/w them. 

*/

module.exports = ({ context, node }) => {
  if (
    !isJSONFile(context) ||
    !Array.isArray(node.comments) ||
    node.comments.length < 2
  ) {
    // is not a json file or the file
    // has not been through the plugin preprocessor
    return INVALID_SOURCE;
  }

  const { value: source } = node.comments[0];
  const { value: sourceFilePath } = node.comments[1];

  // valid source
  return {
    valid: true,
    source,
    sourceFilePath
  };
};
