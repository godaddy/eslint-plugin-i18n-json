const espree = require('espree');

/*
  Rule runner which gives back the actual
  errors.
*/

module.exports = rule => ({ code, options, filename }) => {
  const node = espree.parse(code, {
    comment: true
  });
  const receivedErrors = [];
  const test = {
    context: {
      report: error => receivedErrors.push(error),
      options,
      getFilename: () => filename
    },
    node
  };
  rule.create(test.context).Program(test.node);
  return receivedErrors;
};
