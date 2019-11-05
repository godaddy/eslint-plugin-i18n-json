const deepForOwn = require('./deep-for-own');

describe('deepForOwn', () => {
  it('will stop early if the iteratee returns false', () => {
    const obj = {
      a: {
        b: {
          c: 'value'
        }
      }
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
  it('will not traverse ignored paths', () => {
    const obj = {
      a: {
        b: {
          c: 'value'
        }
      },
      d: {
        e: {
          f: 'value'
        }
      },
      g: {
        h: {
          i: 'value'
        }
      },
      j: 'value'
    };
    const visited = [];
    deepForOwn(obj, (value, key) => {
      visited.push(key);
      return true;
    }, {
      ignorePaths: ['a.b', 'd.e.f', 'g']
    });
    expect(visited).toEqual(['a', 'd', 'j', 'e']);
  });
});
