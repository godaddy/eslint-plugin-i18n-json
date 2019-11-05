const { RuleTester } = require('eslint');
const strip = require('strip-ansi');
const runRule = require('../test/run-rule');
const rule = require('./valid-message-syntax');

const ruleTester = new RuleTester();

jest.mock(
  'path/to/upper-case-only-format.js',
  () => (message) => {
    if (message.toUpperCase() !== message) {
      throw new SyntaxError('MESSAGE MUST BE IN UPPERCASE!');
    }
  },
  {
    virtual: true
  }
);

ruleTester.run('valid-message-syntax', rule, {
  valid: [
    // ignores non json files
    {
      code: `
        /*var x = 123;*//*path/to/file.js*/
      `,
      options: [],
      filename: 'file.js'
    },
    // integrated icu check
    {
      code: `
      /*{
          "translationKeyA": "translation value a",
          "translationKeyB": "translation value b",
          "translationKeyC": "translation value escaped curly brackets '{}'",
          "translationKeyD": "translation value with backslash \u005C"
      }*//*path/to/file.json*/
      `,
      options: [
        {
          syntax: 'icu'
        }
      ],
      filename: 'file.json'
    },
    // non-empty-string check nested translations
    {
      code: `
      /*{
        "levelOne": {
          "translationKeyA": "translation value a",
          "translationKeyB": "translation value b",
          "levelTwo" : {
            "translationKeyC": "translation value c"
          }
        }
      }*//*path/to/file.json*/
      `,
      options: [
        {
          syntax: 'icu'
        }
      ],
      filename: 'file.json'
    },
    // non-empty-string check nested translations
    {
      code: `
      /*{
        "levelOne": {
          "translationKeyA": "a",
          "translationKeyB": "b",
          "levelTwo" : {
            "translationKeyC": "c"
          }
        }
      }*//*path/to/file.json*/
      `,
      options: [
        {
          syntax: 'non-empty-string'
        }
      ],
      filename: 'file.json'
    },
    // custom message format (upper case only)
    {
      code: `
      /*{
          "translationKeyA": "TRANSLATION VALUE A",
          "translationKeyB": "TRANSLATION VALUE B"
      }*//*path/to/file.json*/
      `,
      options: [
        {
          syntax: 'path/to/upper-case-only-format.js'
        }
      ],
      filename: 'file.json'
    },
    // no keys
    {
      code: `
      /*{}*//*path/to/file.json*/
      `,
      options: [
        {
          syntax: 'icu'
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
          syntax: 'icu'
        }
      ],
      filename: 'file.json'
    },
    // ignore keys
    {
      code: `
      /*{
          "translationKeyA": "invalid translation { value a",
          "translationKeyB": "translation value b",
          "translationKeyC": {
            "metadata": [ "value" ] 
          }
      }*//*path/to/file.json*/
      `,
      options: [
        {
          syntax: 'icu'
        }
      ],
      filename: 'file.json',
      settings: {
        'i18n-json/ignore-keys': ['translationKeyA', 'translationKeyC']
      }
    }
  ],
  invalid: [
    // bad path for custom message format
    {
      code: `
      /*{
          "translationKeyA": "translation value a",
          "translationKeyB": "translation value b"
      }*//*path/to/file.json*/
      `,
      options: [
        {
          syntax: 'path/to/does-not-exist.js'
        }
      ],
      filename: 'file.json',
      errors: [
        {
          message: /Error configuring syntax validator\. Rule option specified: path\/to\/does-not-exist\.js\. Error: cannot find module /gi,
          line: 0
        }
      ]
    },
    // no option specified
    {
      code: `
      /*{
          "translationKeyA": "translation value a {"
      }*//*path/to/file.json*/
      `,
      options: [],
      filename: 'file.json',
      errors: [
        {
          message: /"syntax" not specified in rule option/g,
          line: 0
        }
      ]
    }
  ]
});

describe('Snapshot Tests for Invalid Code', () => {
  const run = runRule(rule);
  test('using "non-empty-string" validator and has empty messages', () => {
    const errors = run({
      code: `
      /*{
          "translationKeyA": "",
          "translationKeyB": null
      }*//*path/to/file.json*/
      `,
      options: [
        {
          syntax: 'non-empty-string'
        }
      ],
      filename: 'file.json'
    });
    expect(strip(errors[0].message)).toMatchSnapshot();
  });
  test('custom message format (upper case only)', () => {
    const errors = run({
      code: `
      /*{
          "translationKeyA": "translation value a",
          "translationKeyB": "translation value b"
      }*//*path/to/file.json*/
      `,
      options: [
        {
          syntax: 'path/to/upper-case-only-format.js'
        }
      ],
      filename: 'file.json'
    });
    expect(strip(errors[0].message)).toMatchSnapshot();
  });
  test('nested translations - icu syntax check', () => {
    const errors = run({
      code: `
      /*{
        "levelOne": {
          "translationKeyA": "translation value a",
          "translationKeyB": "translation value b {",
          "translationKeyD": "translation value d '{}",
          "levelTwo" : {
            "translationKeyC": "translation value c {"
          }
        }
      }*//*path/to/file.json*/
      `,
      options: [
        {
          syntax: 'icu'
        }
      ],
      filename: 'file.json'
    });
    expect(strip(errors[0].message)).toMatchSnapshot();
  });
  test('no empty objects', () => {
    const errors = run({
      code: `
      /*{
        "levelOne": {}
      }*//*path/to/file.json*/
      `,
      options: [
        {
          syntax: 'icu'
        }
      ],
      filename: 'file.json'
    });
    expect(strip(errors[0].message)).toMatchSnapshot();
  });
  test('no arrays or numbers', () => {
    const errors = run({
      code: `
      /*{
        "levelOne": [ "data" ],
        "levelTwo": 5
      }*//*path/to/file.json*/
      `,
      options: [
        {
          syntax: 'icu'
        }
      ],
      filename: 'file.json'
    });
    expect(strip(errors[0].message)).toMatchSnapshot();
  });
});
