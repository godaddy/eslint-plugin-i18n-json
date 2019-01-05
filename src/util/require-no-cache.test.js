jest.mock(
  'path/to/file',
  () => {
    return {};
  },
  {
    virtual: true,
  }
);

const requireNoCache = require('./require-no-cache');

describe('require-no-cache', () => {
  it('will not use the require cache for a subsequent require', () => {
    const a = requireNoCache('path/to/file');
    console.log(require.cache);
    const b = requireNoCache('path/to/file');
    expect(a === b).toBe(false);
  });
});
