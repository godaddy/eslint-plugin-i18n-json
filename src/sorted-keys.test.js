const {
  RuleTester,
} = require('eslint');
const rule = require('./sorted-keys');

const ruleTester = new RuleTester();

ruleTester.run('sorted-keys', rule, {
  valid: [
    // default sort order and indentSpace.
    {
      code: `
      /*{
          "translationKeyA": "translation value a",
          "translationKeyB": "translation value b"
      }*/
      `,
      options: [],
    },
    {
      code: `
      /*{
          "translationKeyA": "translation value a",
          "translationKeyB": "translation value b"
      }*/
      `,
      options: [{
        order: 'asc',
        indentSpaces: 2,
      }],
    },
    {
      code: `
      /*{
          "translationKeyB": "translation value b",
          "translationKeyA": "translation value a"
      }*/
      `,
      options: [{
        order: 'desc',
        indentSpaces: 2,
      }],
    },
    {
      code: `
      /*{
          "translationKeyB": {
            "nested2": "nested value 1",
            "nested1": "nested value 2"
          },
          "translationKeyA": "translation value a"
      }*/
      `,
      options: [{
        order: 'desc',
        indentSpaces: 2,
      }],
    },
    {
      code: `
      /*{
          "translationKeyA": {
            "nested1": "nested value 1",
            "nested2": "nested value 2"
          },
          "translationKeyB": "translation value a"
      }*/
      `,
      options: [{
        order: 'asc',
        indentSpaces: 2,
      }],
    },
    {
      // error parsing the json - ignore to allow i18n-json/valid-json rule to handle it
      code: `
      /*{*/
      `,
      options: [{
        order: 'asc',
        indentSpaces: 2,
      }],
    },
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
      }*/
      `,
      options: [{
        order: 'asc',
        indentSpaces: 2,
      }],
      errors: [
        {
          message: 'Keys should be sorted, please use --fix.',
          line: 0,
          fix: {
            range: [0, 118],
            text: JSON.stringify({
              translationA: 'translation value a',
              translationB: 'translation value b',
            }, null, 2),
          },
        },
      ],
    },
    // descending order test
    {
      code: `
      /*{
          "translationKeyA": "translation value a",
          "translationKeyB": "translation value b"
      }*/
      `,
      options: [{
        order: 'desc',
        indentSpaces: 1,
      }],
      errors: [
        {
          message: 'Keys should be sorted, please use --fix.',
          line: 0,
          fix: {
            range: [0, 118],
            text: JSON.stringify({
              translationB: 'translation value b',
              translationA: 'translation value a',
            }, null, 1),
          },
        },
      ],
    },
  ],
});
