const {
  RuleTester,
} = require('eslint');
const strip = require('strip-ansi');
const rule = require('./identical-keys');
const runRule = require('../test/run-rule');

const ruleTester = new RuleTester();

jest.mock('./compare-file-b.json', () => ({
  translationLevelOne: {
    translationKeyA: 'value a',
    translationKeyB: 'value b',
    translationKeyC: 'value c',
  },
}), {
  virtual: true,
});

jest.mock('./compare-file-a.json', () => ({
  translationLevelOne: {
    translationKeyA: 'value a',
    translationsLevelTwo: {
      translationKeyB: 'value b',
      translationsLevelThree: {
        translationKeyC: 'value c',
      },
    },
  },
}), {
  virtual: true,
});

jest.mock('./identity-structure.js', () => jest.fn()
  .mockImplementationOnce(t => t)
  .mockImplementationOnce(() => {
    throw new Error('something went wrong');
  }), {
  virtual: true,
});

jest.mock('./wrong-structure-generator.js', () => jest.fn()
  .mockImplementationOnce(() => ({
    'other-key': 'other value',
  })), {
  virtual: true,
});


ruleTester.run('identical-keys', rule, {
  valid: [
    // single file path to compare with
    {
      code: `
      /*{
        "translationLevelOne": {
          "translationKeyA": "value a",
          "translationsLevelTwo": {
            "translationKeyB": "value b",
            "translationsLevelThree": {
              "translationKeyC": "value c"
            }
          }
        }
      }*//*file-path*/
      `,
      options: [
        {
          filePath: './compare-file-a.json',
        },
      ],
    },
    // mapping to match which file we should use to compare structure
    {
      code: `
      /*{
        "translationLevelOne": {
          "translationKeyA": "value a",
          "translationsLevelTwo": {
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
            'compare-file-a.json': './compare-file-a.json',
            'compare-file-b.json': './compare-file-b.json',
          },
        },
      ],
    },
    // structure generator function
    {
      code: `
      /*{
        "translationLevelOne": {
          "translationKeyA": "value a"
        }
      }*//*/path/to/this/file.json*/
      `,
      options: [
        {
          filePath: './identity-structure.js',
        },
      ],
    },
    // let the i18n-json/valid-json rule catch the invalid json translations
    {
      code: `
      /*{*//*file-path*/
      `,
      options: [
        {
          filePath: './compare-file.json',
        },
      ],
    },
  ],
  invalid: [
    // no option passed
    {
      code: `
      /*{}*//*file-path*/
      `,
      options: [],
      errors: [
        {
          message: '"filePath" rule option not specified.',
          line: 0,
        },
      ],
    },
    // key structure function throws
    {
      code: `
      /*{}*//*file-path.json*/
      `,
      options: [
        {
          filePath: './identity-structure.js',
        },
      ],
      errors: [
        {
          message: /Error when calling custom key structure function/,
          line: 0,
        },
      ],
    },
    // comparison file doesn't exist
    {
      code: `
      /*{}*//*file-path.json*/
      `,
      options: [
        {
          filePath: './does-not-exist.js',
        },
      ],
      errors: [
        {
          message: /Error parsing or retrieving key structure comparison file/,
          line: 0,
        },
      ],
    },
    // mapped file doesn't exist
    {
      code: `
      /*{}*//*path/to/file.json*/
      `,
      options: [
        {
          filePath: {
            'file.json': 'does-not-exist.json',
          },
        },
      ],
      errors: [
        {
          message: /Error parsing or retrieving key structure comparison file based on "filePath" mapping/,
          line: 0,
        },
      ],
    },
    // no match for this file found in the mapping
    {
      code: `
      /*{}*//*path/to/file.json*/
      `,
      options: [
        {
          filePath: {
            'other-file.json': 'does-not-exist.json', // shouldn't require does-not-exist.json, since it doesn't match
          },
        },
      ],
      errors: [
        {
          message: /Current translation file does not have a matching entry in the "filePath" map/,
          line: 0,
        },
      ],
    },
    // certain keys are globally ignored
    {
      code: `
      /*{
        "translationLevelOne": {
          "translationKeyA": "value a",
          "translationsLevelTwo": {
            "translationsLevelThree": {
              "translationKeyC": "value c"
            }
          }
        }
      }*//*file-path*/
      `,
      options: [
        {
          filePath: './compare-file-a.json',
        },
      ],
      settings: {
        'i18n-json/ignore-keys': [
          'translationLevelOne.translationLevelTwo.translationKeyB'
        ]
      }
    },
  ],
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
          filePath: './compare-file-a.json',
        },
      ],
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
            'file.json': './compare-file-a.json',
          },
        },
      ],
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
          filePath: './wrong-structure-generator.js',
        },
      ],
    });
    expect(strip(errors[0].message)).toMatchSnapshot();
  });
});
