const rule = require('./valid-json');
const { RuleTester } = require('eslint');

const ruleTester = new RuleTester();

jest.mock('chalk', () => ({
  bold: {
    red: jest.fn(str => str)
  }
}));

jest.mock('./util/require-no-cache', () =>
  jest.fn().mockImplementation((path) => {
    switch (path) {
      case './json-linter-pass.js':
        return () => ({});
      case './json-linter-error.js':
        return () => {
          throw new SyntaxError('line 5: invalid json syntax');
        };
      default:
        return undefined;
    }
  }));

ruleTester.run('valid-json', rule, {
  valid: [
    // ignores non json files
    {
      code: `
        /*var x = 123;*//*path/to/file.js*/
      `,
      options: [],
      filename: 'file.js'
    },
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
    // supports a custom linter
    {
      code: `
        /*{}*//*path/to/file.json*/
      `,
      options: [
        {
          linter: './json-linter-pass.js'
        }
      ],
      filename: 'file.json'
    }
  ],
  invalid: [
    {
      code: `
      /*{
          "translationKeyA": "translation value a"
          "translationKeyB: "translation value b"
      }*//*path/to/file.json*/
      `,
      options: [],
      filename: 'file.json',
      errors: [
        {
          message: /\nInvalid JSON\.\n\n.*/,
          line: 0,
          col: 0
        }
      ]
    },
    {
      code: `
      /**//*path/to/file.json*/
      `,
      options: [],
      filename: 'file.json',
      errors: [
        {
          message: /\nInvalid JSON\.\n\n.*/,
          line: 0,
          col: 0
        }
      ]
    },
    // supports a custom linter
    {
      code: `
        /*{*//*path/to/file.json*/
      `,
      options: [
        {
          linter: './json-linter-error.js'
        }
      ],
      filename: 'file.json',
      errors: [
        {
          message: /\nInvalid JSON\.\n\n.*/,
          line: 5,
          col: 0
        }
      ]
    },
    // parser must return a plain object
    {
      code: `
        /*"SOME_VALID_JSON"*//*path/to/file.json*/
      `,
      options: [],
      filename: 'file.json',
      errors: [
        {
          message: /\nInvalid JSON\.\n\n.*SyntaxError: Translation file must be a JSON object\./,
          line: 0,
          col: 0
        }
      ]
    }
  ]
});
