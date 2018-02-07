const deepForOwn = require('./deep-for-own');

describe('deepForOwn', () => {
  it('will stop early if the iteratee returns false', () => {
    const obj = {
      a: {
        b: {
          c: 'value',
        },
      },
    };
    const visited = [];
    deepForOwn(obj, (value, key) => {
      visited.push(key);
      if (key === 'b') {
        return false;
      }
      return true;
    });
    expect(visited).toEqual(['a', 'b']);
  });
});
