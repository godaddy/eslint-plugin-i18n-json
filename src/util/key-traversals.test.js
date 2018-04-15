const keyTraverals = require('./key-traversals');

describe('keyTraversals', () => {
  it('sorts object keys in descending case sensitive order', () => {
    expect(keyTraverals.desc({
      C: 'value',
      B: 'value',
      A: 'value',
      b: 'value',
      a: 'value',
      c: 'value',
    })).toEqual([
      'c',
      'b',
      'a',
      'C',
      'B',
      'A',
    ]);
  });
});
