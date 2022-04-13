const { RuleTester } = require('eslint');
const rule = require('./identical-placeholders');

const ruleTester = new RuleTester();

jest.mock(
  'path/to/reference-file.json',
  () => ({
    rawText: {
      label1: 'Title'
    },
    noformat: {
      search: {
        label2: 'Hi {user}'
      }
    },
    multipleVariables: 'Hi {user}, it is {today, date, medium}.',
    numberFormat: '{count, number} users',
    select: 'You selected {choice, select, yes {Yea} no {Nay} other {Maybe}}',
    'nested.select': '{done, select, no {There is more to it {count, number}.} other {Done.}}',
    'plural.with.substitution':
      'Cart: {itemCount, plural, =0 {no items} one {# item} other {# items}}.',
    richText: 'this is the price <bold>{price, number}</bold>.'
  }),
  {
    virtual: true
  }
);

ruleTester.run('identical-placeholders', rule, {
  valid: [
    // ignores non json files
    {
      code: `
        /*var x = 123;*//*path/to/file.js*/
      `,
      options: [
        {
          filePath: 'path/to/reference-file.json'
        }
      ],
      filename: 'file.js'
    },
    // ignores based on ignore-keys settings
    {
      code: `
      /*{
        "noformat": {
          "search": {
            "label2": "Hi {user11}"
          }
        }
      }*//*path/to/file.json*/
      `,
      options: [
        {
          filePath: 'path/to/reference-file.json'
        }
      ],
      filename: 'file.json',
      settings: {
        'i18n-json/ignore-keys': ['noformat.search.label2']
      }
    },
    // ignores invaid format messages
    {
      code: `
      /*{
        "numberFormat": "{count, number12} users"
      }*//*path/to/file.json*/
      `,
      options: [
        {
          filePath: 'path/to/reference-file.json'
        }
      ],
      filename: 'file.json'
    },
    // ignores any differences in raw text
    {
      code: `
      /*{
        "rawText": {
          "label1": "†ï†lê"
        },
        "plural.with.substitution": '¢คrt -> {itemCount, plural, =0 {ɳσ ιƚҽɱʂ} one {# ιƚҽɱ} other {# ιƚҽɱʂ}}',
      }*//*path/to/file.json*/
      `,
      options: [
        {
          filePath: 'path/to/reference-file.json'
        }
      ],
      filename: 'file.json'
    },
    // skips comparison with reference file
    {
      code: `
      /*{
        "rawText": {
          "label1": "†ï†lê"
        }
      }*//*path/to/reference-file.json*/
      `,
      options: [
        {
          filePath: 'path/to/reference-file.json'
        }
      ],
      filename: 'reference-file.json'
    },
    // doesn't error on valid strings
    {
      code: `
      /*{
        "rawText": {
          "label1": "Tιƚʅҽ"
        },
        "multipleVariables": "It is {today, date, medium}, {user}.",
        "numberFormat": "{count, number} users"
      }*//*path/to/file.json*/
      `,
      options: [
        {
          filePath: 'path/to/reference-file.json'
        }
      ],
      filename: 'file.json'
    }
  ],
  invalid: [
    // errors on invalid config
    {
      code: `
      /*{}*//*path/to/file.json*/
      `,
      options: [],
      filename: 'file.json',
      errors: [
        {
          message: '"filePath" rule option not specified.',
          line: 0
        }
      ]
    },
    // errors on variable name mismatch
    {
      code: `
      /*{
        "noformat": {
          "search": {
            "label2": "Hi {user11}"
          }
        }
      }*//*path/to/file.json*/
      `,
      options: [
        {
          filePath: 'path/to/reference-file.json'
        }
      ],
      filename: 'file.json',
      errors: [
        {
          message: /Placeholders don't match/,
          line: 0
        }
      ]
    },
    // errors on variables count mismatch
    {
      code: `
      /*{
        "noformat": {
          "search": {
            "label2": "Hi"
          }
        }
      }*//*path/to/file.json*/
      `,
      options: [
        {
          filePath: 'path/to/reference-file.json'
        }
      ],
      filename: 'file.json',
      errors: [
        {
          message: /Placeholders don't match/,
          line: 0
        }
      ]
    },
    // errors on 'select' format options mismatch
    {
      code: `
      /*{
        "select": "You selected {choice, select, YΣƧ {Yea} no {Nay} other {Maybe}}"
      }*//*path/to/file.json*/
      `,
      options: [
        {
          filePath: 'path/to/reference-file.json'
        }
      ],
      filename: 'file.json',
      errors: [
        {
          message: /Placeholders don't match/,
          line: 0
        }
      ]
    },
    // errors on 'select' format options count mismatch
    {
      code: `
      /*{
        "select": "You selected {choice, select, yes {Yea} other {Maybe}}"
      }*//*path/to/file.json*/
      `,
      options: [
        {
          filePath: 'path/to/reference-file.json'
        }
      ],
      filename: 'file.json',
      errors: [
        {
          message: /Placeholders don't match/,
          line: 0
        }
      ]
    },
    // errors on nested variables mismatch
    {
      code: `
      /*{
        "nested.select": "{done, select, no {There is more to it {count1, number}.} other {Done.}}"
      }*//*path/to/file.json*/
      `,
      options: [
        {
          filePath: 'path/to/reference-file.json'
        }
      ],
      filename: 'file.json',
      errors: [
        {
          message: /Placeholders don't match/,
          line: 0
        }
      ]
    },
    // errors on 'plural' format options mismatch
    {
      code: `
      /*{
        "plural.with.substitution": "Cart: {itemCount, plural, =0 {no items} uno {# item} other {# items}}."
      }*//*path/to/file.json*/
      `,
      options: [
        {
          filePath: 'path/to/reference-file.json'
        }
      ],
      filename: 'file.json',
      errors: [
        {
          message: /Placeholders don't match/,
          line: 0
        }
      ]
    },
    // errors on rich text variables mismatch
    {
      code: `
      /*{
        "richText": "this is the price <bold>{price}</bold>."
      }*//*path/to/file.json*/
      `,
      options: [
        {
          filePath: 'path/to/reference-file.json'
        }
      ],
      filename: 'file.json',
      errors: [
        {
          message: /Placeholders don't match/,
          line: 0
        }
      ]
    }
  ]
});
