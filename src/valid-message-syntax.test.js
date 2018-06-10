const {
  RuleTester,
} = require('eslint');
const strip = require('strip-ansi');
const runRule = require('../test/run-rule');
const rule = require('./valid-message-syntax');

const ruleTester = new RuleTester();

jest.mock('path/to/upper-case-only-format.js', () => (message) => {
  if (message.toUpperCase() !== message) {
    throw new SyntaxError('MESSAGE MUST BE IN UPPERCASE!');
  }
}, {
  virtual: true,
});

ruleTester.run('valid-message-syntax', rule, {
  valid: [
    // integrated icu check
    {
      code: `
      /*{
          "translationKeyA": "translation value a",
          "translationKeyB": "translation value b"
      }*/
      `,
      options: [
        {
          syntax: 'icu',
        },
      ],
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
      }*/
      `,
      options: [
        {
          syntax: 'icu',
        },
      ],
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
      }*/
      `,
      options: [
        {
          syntax: 'non-empty-string',
        },
      ],
    },
    // custom message format (upper case only)
    {
      code: `
      /*{
          "translationKeyA": "TRANSLATION VALUE A",
          "translationKeyB": "TRANSLATION VALUE B"
      }*/
      `,
      options: [
        {
          syntax: 'path/to/upper-case-only-format.js',
        },
      ],
    },
    // no keys
    {
      code: `
      /*{}*/
      `,
      options: [
        {
          syntax: 'icu',
        },
      ],
    },
    {
      // error parsing the json - ignore to allow i18n-json/valid-json rule to handle it
      code: `
      /*{*/
      `,
      options: [
        {
          syntax: 'icu',
        },
      ],
    },
    // ignore keys
    {
      code: `
      /*{
          "translationKeyA": "invalid translation { value a",
          "translationKeyB": "translation value b"
      }*/
      `,
      options: [
        {
          syntax: 'icu',
        },
      ],
      settings: {
        'i18n-json/ignore-keys': [
          'translationKeyA'
        ]
      }
    },
  ],
  invalid: [
    // bad path for custom message format
    {
      code: `
      /*{
          "translationKeyA": "translation value a",
          "translationKeyB": "translation value b"
      }*/
      `,
      options: [
        {
          syntax: 'path/to/does-not-exist.js',
        },
      ],
      errors: [
        {
          message: /Error configuring syntax validator\. Rule option specified: path\/to\/does-not-exist\.js\. Error: cannot find module /ig,
          line: 0,
        },
      ],
    },
    // no option specified
    {
      code: `
      /*{
          "translationKeyA": "translation value a {"
      }*/
      `,
      options: [],
      errors: [
        {
          message: /"syntax" not specified in rule option/g,
          line: 0,
        },
      ],
    },
  ],
});

describe('Snapshot Tests for Invalid Code', () => {
  const run = runRule(rule);
  test('using "non-empty-string" validator and has empty messages', () => {
    const errors = run({
      code: `
      /*{
          "translationKeyA": "",
          "translationKeyB": null
      }*/
      `,
      options: [
        {
          syntax: 'non-empty-string',
        },
      ],
    });
    expect(strip(errors[0].message)).toMatchSnapshot();
  });
  test('custom message format (upper case only)', () => {
    const errors = run({
      code: `
      /*{
          "translationKeyA": "translation value a",
          "translationKeyB": "translation value b"
      }*/
      `,
      options: [
        {
          syntax: 'path/to/upper-case-only-format.js',
        },
      ],
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
          "levelTwo" : {
            "translationKeyC": "translation value c {"
          }
        }
      }*/
      `,
      options: [
        {
          syntax: 'icu',
        },
      ],
    });
    expect(strip(errors[0].message)).toMatchSnapshot();
  });
  test('no empty objects', () => {
    const errors = run({
      code: `
      /*{
        "levelOne": {}
      }*/
      `,
      options: [
        {
          syntax: 'icu',
        },
      ],
    });
    expect(strip(errors[0].message)).toMatchSnapshot();
  });
  test('no arrays or numbers', () => {
    const errors = run({
      code: `
      /*{
        "levelOne": [ "data" ],
        "levelTwo": 5
      }*/
      `,
      options: [
        {
          syntax: 'icu',
        },
      ],
    });
    expect(strip(errors[0].message)).toMatchSnapshot();
  });
});
