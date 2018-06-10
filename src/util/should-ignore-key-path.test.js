const shouldIgnoreKeyPath = require('./should-ignore-key-path');

describe('shouldIgnoreKeyPath', () => {
  it('returns false if ignoreKeysList is not an array', () => {
    expect(shouldIgnoreKeyPath(undefined, ['some-key'])).toBe(false);
  });
  it('returns false if the keyPath is not in the ignoreKeysList array', () => {
    const settings = {
      'i18n-json/ignore-keys': [
        'some-key-1'
      ]
    };
    expect(shouldIgnoreKeyPath(settings, ['some-key-2'])).toBe(false);
  });
  it('returns true if the keyPath is in the ignoreKeysList array', () => {
    const settings = {
      'i18n-json/ignore-keys': [
        'some-key-1'
      ]
    };
    expect(shouldIgnoreKeyPath(settings, ['some-key-1'])).toBe(true);
  });
});