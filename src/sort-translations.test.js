const sortTranslations = require('./sort-translations');

describe('sortTranslations', () => {
  it('ignores an invalid JSON source to allow the i18n-json/valid-json rule to catch it', () => {
    const badJson = '{';
    expect(sortTranslations(badJson)).toEqual([]);
  });
  it('will not sort if already sorted in ASC order', () => {
    const sorted = `
    {
      "a": "value",
      "b": "value"
    }
    `;
    expect(sortTranslations(sorted)).toEqual([]);
  });
  it('will sort if not already sorted in ASC order', () => {
    const unsorted = `
    {
      "b": "value",
      "a": "value"
    }
    `;
    const sorted = {
      a: 'value',
      b: 'value',
    };
    expect(sortTranslations(unsorted)).toEqual([{
      fix: {
        range: [0, unsorted.length],
        text: JSON.stringify(sorted, null, 2),
      },
      line: 0,
      column: 0,
      message: 'Keys should be sorted, please use --fix',
    }]);
  });
  it('will sort nested translations if not already sorted in ASC order', () => {
    const unsorted = `
    {
      "levelOne": {
        "z": "value",
        "y": "value",
        "levelTwo": {
          "b": "value",
          "c": "value",
          "a": "value"
        }
      }
    }
    `;
    const sorted = {
      levelOne: {
        levelTwo: {
          a: 'value',
          b: 'value',
          c: 'value',
        },
        y: 'value',
        z: 'value',
      },
    };
    expect(sortTranslations(unsorted)).toEqual([{
      fix: {
        range: [0, unsorted.length],
        text: JSON.stringify(sorted, null, 2),
      },
      line: 0,
      column: 0,
      message: 'Keys should be sorted, please use --fix',
    }]);
  });
  it('does not fail with other data types in the object', () => {
    const unsorted = `
    {
      "levelOne": {
        "z": [ 1, 2, 3],
        "y": "value",
        "levelTwo": {
          "b": "value",
          "c": [ 1, 2, 3],
          "a": "value"
        }
      }
    }
    `;
    const sorted = {
      levelOne: {
        levelTwo: {
          a: 'value',
          b: 'value',
          c: [1, 2, 3],
        },
        y: 'value',
        z: [1, 2, 3],
      },
    };
    expect(sortTranslations(unsorted)).toEqual([{
      fix: {
        range: [0, unsorted.length],
        text: JSON.stringify(sorted, null, 2),
      },
      line: 0,
      column: 0,
      message: 'Keys should be sorted, please use --fix',
    }]);
  });
});
