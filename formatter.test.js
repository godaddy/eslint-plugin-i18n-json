const formatter = require('./formatter');
const stripAnsi = require('strip-ansi');

const strippedFormatter = (...args) => stripAnsi(formatter(...args));

describe('formatter', () => {
  it('returns an empty string when there aren\'t any warnings or errors across all files', () => {
    expect(strippedFormatter([
      {
        filePath: 'some/file',
        messages: [],
        warningCount: 0,
        errorCount: 0
      }
    ])).toMatchSnapshot();
  });
  it('will not display any message for an individual file which does not have any warnings or errors', () => {
    const output = strippedFormatter([
      {
        filePath: 'bad/file',
        messages: [{
          ruleId: 'some-rule',
          severity: 2,
          message: 'file is bad'
        }],
        errorCount: 1,
        warningCount: 0
      },
      {
        filePath: 'good/file',
        messages: [],
        warningCount: 0,
        errorCount: 0
      }
    ]);
    expect(output).toMatchSnapshot();
  });
  it('will display errors before warnings', () => {
    const output = strippedFormatter([
      {
        filePath: 'bad/file',
        messages: [
          {
            ruleId: 'some-rule',
            severity: 1,
            message: 'file has first warning'
          },
          {
            ruleId: 'some-rule',
            severity: 1,
            message: 'file has second warning'
          },
          {
            ruleId: 'some-rule',
            severity: 2,
            message: 'file is bad'
          },
          {
            ruleId: 'some-rule',
            severity: 2,
            message: 'file is pretty bad'
          }
        ],
        errorCount: 2,
        warningCount: 2
      }
    ]);
    expect(output).toMatchSnapshot();
  });
  it('will display issues across many files', () => {
    const output = strippedFormatter([
      {
        filePath: 'bad/file',
        messages: [{
          ruleId: 'some-rule',
          severity: 2,
          message: 'file is bad'
        }],
        errorCount: 1,
        warningCount: 0
      },
      {
        filePath: 'bad/file2',
        messages: [{
          ruleId: 'some-rule',
          severity: 1,
          message: 'file has a warning'
        }],
        errorCount: 0,
        warningCount: 1
      },
      {
        filePath: 'bad/file3',
        messages: [
          {
            ruleId: 'some-rule',
            severity: 2,
            message: 'file is bad'
          },
          {
            ruleId: 'some-rule',
            severity: 1,
            message: 'file has a warning'
          }
        ],
        errorCount: 1,
        warningCount: 1
      }
    ]);
    expect(output).toMatchSnapshot();
  });
});
