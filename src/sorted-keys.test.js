const { RuleTester } = require('eslint');
const rule = require('./sorted-keys');

jest.mock(
  'path/to/custom-sort.js',
  () => translations => Object.keys(translations).sort((keyA, keyB) => keyA.localeCompare(keyB, 'de')),
  {
    virtual: true
  }
);

const ruleTester = new RuleTester();

ruleTester.run('sorted-keys', rule, {
  valid: [
    // ignores non json files
    {
      code: `
        /*var x = 123;*//*path/to/file.js*/
      `,
      options: [],
      filename: 'file.js'
    },
    // default sort order and indentSpace.
    {
      code: `
      /*{
          "translationKeyA": "translation value a",
          "translationKeyB": "translation value b"
      }*//*path/to/file.json*/
      `,
      options: [],
      filename: 'file.json'
    },
    {
      code: `
      /*{
          "translationKeyA": "translation value a",
          "translationKeyB": "translation value b"
      }*//*path/to/file.json*/
      `,
      options: [
        {
          order: 'asc',
          indentSpaces: 2
        }
      ],
      filename: 'file.json'
    },
    {
      code: `
      /*{
          "translationKeyB": "translation value b",
          "translationKeyA": "translation value a"
      }*//*path/to/file.json*/
      `,
      options: [
        {
          order: 'desc',
          indentSpaces: 2
        }
      ],
      filename: 'file.json'
    },
    {
      code: `
      /*{
          "translationKeyB": {
            "nested2": "nested value 1",
            "nested1": "nested value 2"
          },
          "translationKeyA": "translation value a"
      }*//*path/to/file.json*/
      `,
      options: [
        {
          order: 'desc',
          indentSpaces: 2
        }
      ],
      filename: 'file.json'
    },
    {
      code: `
      /*{
          "translationKeyA": {
            "nested1": "nested value 1",
            "nested2": "nested value 2"
          },
          "translationKeyB": "translation value a"
      }*//*path/to/file.json*/
      `,
      options: [
        {
          order: 'asc',
          indentSpaces: 2
        }
      ],
      filename: 'file.json'
    },
    {
      code: `
      /*{
          "äTranslationKey": "translation value ä",
          "zTranslationKey": "translation value z"
      }*//*path/to/file.json*/
      `,
      options: [
        {
          sortFunctionPath: 'path/to/custom-sort.js',
          indentSpaces: 2
        }
      ],
      filename: 'file.json'
    },
    {
      // error parsing the json - ignore to allow i18n-json/valid-json rule to handle it
      code: `
      /*{*//*path/to/file.json*/
      `,
      options: [
        {
          order: 'asc',
          indentSpaces: 2
        }
      ],
      filename: 'file.json'
    }
  ],
  invalid: [
    /*
      if order doesn't match what is specified,
      it should report a fixable error with
      range spanning the whole JSON file,
      and emitted text being the sorted translations
      with proper indent format.
    */
    // ascending order test
    {
      code: `
      /*{
          "translationKeyB": "translation value b",
          "translationKeyA": "translation value a"
      }*//*path/to/file.json*/
      `,
      options: [
        {
          order: 'asc',
          indentSpaces: 2
        }
      ],
      filename: 'file.json',
      errors: [
        {
          message: 'Keys should be sorted, please use --fix.',
          line: 0,
          fix: {
            range: [0, 112],
            text: JSON.stringify(
              {
                translationA: 'translation value a',
                translationB: 'translation value b'
              },
              null,
              2
            )
          }
        }
      ]
    },
    // descending order test
    {
      code: `
      /*{
          "translationKeyA": "translation value a",
          "translationKeyB": "translation value b"
      }*//*path/to/file.json*/
      `,
      options: [
        {
          order: 'desc',
          indentSpaces: 1
        }
      ],
      filename: 'file.json',
      errors: [
        {
          message: 'Keys should be sorted, please use --fix.',
          line: 0,
          fix: {
            range: [0, 112],
            text: JSON.stringify(
              {
                translationB: 'translation value b',
                translationA: 'translation value a'
              },
              null,
              2
            )
          }
        }
      ]
    },
    {
      code: `
      /*{
          "zTranslationKey": "translation value z",
          "äTranslationKey": "translation value ä"
      }*//*path/to/file.json*/
      `,
      options: [
        {
          sortFunctionPath: 'path/to/custom-sort.js',
          indentSpaces: 2
        }
      ],
      filename: 'file.json',
      errors: [
        {
          message: 'Keys should be sorted, please use --fix.',
          line: 0,
          fix: {
            range: [0, 112],
            text: JSON.stringify(
              {
                äTranslationKey: 'translation value ä',
                zTranslationKey: 'translation value z'
              },
              null,
              2
            )
          }
        }
      ]
    }
  ]
});
