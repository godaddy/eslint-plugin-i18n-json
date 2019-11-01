const { RuleTester } = require('eslint');
const strip = require('strip-ansi');
const rule = require('./identical-keys');
const runRule = require('../test/run-rule');

const ruleTester = new RuleTester();

jest.mock(
  'path/to/compare-file-b.json',
  () => ({
    translationLevelOne: {
      translationKeyA: 'value a',
      translationKeyB: 'value b',
      translationKeyC: 'value c'
    }
  }),
  {
    virtual: true
  }
);

jest.mock(
  'path/to/compare-file-a.json',
  () => ({
    translationLevelOne: {
      translationKeyA: 'value a',
      translationLevelTwo: {
        translationKeyB: 'value b',
        translationsLevelThree: {
          translationKeyC: 'value c'
        }
      }
    }
  }),
  {
    virtual: true
  }
);

jest.mock(
  'path/to/identity-structure.js',
  () =>
    jest
      .fn()
      .mockImplementationOnce(t => t)
      .mockImplementationOnce(() => {
        throw new Error('something went wrong');
      }),
  {
    virtual: true
  }
);

jest.mock(
  'path/to/wrong-structure-generator.js',
  () =>
    jest.fn().mockImplementationOnce(() => ({
      'other-key': 'other value'
    })),
  {
    virtual: true
  }
);

ruleTester.run('identical-keys', rule, {
  valid: [
    // ignores non json files
    {
      code: `
        /*var x = 123;*//*path/to/file.js*/
      `,
      options: [],
      filename: 'file.js'
    },
    // single file path to compare with
    {
      code: `
      /*{
        "translationLevelOne": {
          "translationKeyA": "value a",
          "translationLevelTwo": {
            "translationKeyB": "value b",
            "translationsLevelThree": {
              "translationKeyC": "value c"
            }
          }
        }
      }*//*path/to/file.json*/
      `,
      options: [
        {
          filePath: 'path/to/compare-file-a.json'
        }
      ],
      filename: 'file.json'
    },
    // mapping to match which file we should use to compare structure
    {
      code: `
      /*{
        "translationLevelOne": {
          "translationKeyA": "value a",
          "translationLevelTwo": {
            "translationKeyB": "value b",
            "translationsLevelThree": {
              "translationKeyC": "value c"
            }
          }
        }
      }*//*/path/to/compare-file-a.json*/
      `,
      options: [
        {
          filePath: {
            'compare-file-a.json': 'path/to/compare-file-a.json',
            'compare-file-b.json': 'path/to/compare-file-b.json'
          }
        }
      ],
      filename: 'compare-file-a.json'
    },
    // structure generator function
    {
      code: `
      /*{
        "translationLevelOne": {
          "translationKeyA": "value a"
        }
      }*//*/path/to/file.json*/
      `,
      options: [
        {
          filePath: 'path/to/identity-structure.js'
        }
      ],
      filename: 'file.json'
    },
    // let the i18n-json/valid-json rule catch the invalid json translations
    {
      code: `
      /*{*//*path/to/file.json*/
      `,
      options: [
        {
          filePath: 'path/to/compare-file.json'
        }
      ],
      filename: 'file.json'
    },
    // ignore-keys global setting
    {
      code: `
      /*{
        "translationLevelOne": {
          "translationKeyA": "value a",
          "translationLevelTwo": {
            "translationKeyD": "value d",
            "translationsLevelThree": {
              "translationKeyE": "value e"
            }
          }
        }
      }*//*path/to/file.json*/
      `,
      options: [
        {
          filePath: 'path/to/compare-file-a.json'
        }
      ],
      filename: 'file.json',
      settings: {
        'i18n-json/ignore-keys': ['translationLevelOne.translationLevelTwo']
      }
    }
  ],
  invalid: [
    // no option passed
    {
      code: `
      /*{}*//*path/to/file.json*/
      `,
      filename: 'file.json',
      errors: [
        {
          message: '"filePath" rule option not specified.',
          line: 0
        }
      ]
    },
    // key structure function throws
    {
      code: `
      /*{}*//*path/to/file.json*/
      `,
      options: [
        {
          filePath: 'path/to/identity-structure.js'
        }
      ],
      filename: 'file.json',
      errors: [
        {
          message: /Error when calling custom key structure function/,
          line: 0
        }
      ]
    },
    // comparison file doesn't exist
    {
      code: `
      /*{}*//*path/to/file.json*/
      `,
      options: [
        {
          filePath: 'path/to/does-not-exist.js'
        }
      ],
      filename: 'file.json',
      errors: [
        {
          message: /Error parsing or retrieving key structure comparison file/,
          line: 0
        }
      ]
    },
    // mapped file doesn't exist
    {
      code: `
      /*{}*//*path/to/file.json*/
      `,
      options: [
        {
          filePath: {
            'file.json': 'path/to/does-not-exist.json'
          }
        }
      ],
      filename: 'file.json',
      errors: [
        {
          message: /Error parsing or retrieving key structure comparison file based on "filePath" mapping/,
          line: 0
        }
      ]
    },
    // no match for this file found in the mapping
    {
      code: `
      /*{}*//*path/to/file.json*/
      `,
      options: [
        {
          filePath: {
            'other-file.json': 'path/to/does-not-exist.json' // shouldn't require does-not-exist.json, since it doesn't match
          }
        }
      ],
      filename: 'file.json',
      errors: [
        {
          message: /Current translation file does not have a matching entry in the "filePath" map/,
          line: 0
        }
      ]
    }
  ]
});

/*
 For tests which should result in errors, we will be using
 Snapshot testing for increased readability of the jest-diff
 output
*/

describe('Snapshot Tests for Invalid Code', () => {
  const run = runRule(rule);
  test('single comparison file - structure mismatch', () => {
    const errors = run({
      code: `
      /*{
        "translationLevelOne": {
          "translationKeyY": "value y",
          "translationKeyZ": "value z"
        }
      }*//*/path/to/invalid-file.json*/
      `,
      options: [
        {
          filePath: 'path/to/compare-file-a.json'
        }
      ],
      filename: 'file.json'
    });
    expect(strip(errors[0].message)).toMatchSnapshot();
  });
  test('map of comparison files - structure mismatch', () => {
    const errors = run({
      code: `
      /*{
        "translationLevelOne": {
          "translationKeyY": "value y",
          "translationKeyZ": "value z"
        }
      }*//*/path/to/file.json*/
      `,
      options: [
        {
          filePath: {
            'file.json': 'path/to/compare-file-a.json'
          }
        }
      ],
      filename: 'file.json'
    });
    expect(strip(errors[0].message)).toMatchSnapshot();
  });
  test('structure generator function - structure mismatch', () => {
    const errors = run({
      code: `
      /*{
        "translationLevelOne": {
          "translationKeyY": "value y",
          "translationKeyZ": "value z"
        }
      }*//*/path/to/file.json*/
      `,
      options: [
        {
          filePath: 'path/to/wrong-structure-generator.js'
        }
      ],
      filename: 'file.json'
    });
    expect(strip(errors[0].message)).toMatchSnapshot();
  });
});
