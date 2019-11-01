const getTranslationFileSource = require('./get-translation-file-source');

const INVALID_FILE_SOURCE = {
  source: null,
  sourceFilePath: null
};

describe('#getTranslationFileSource', () => {
  it('will return an invalid file source object if the file does not have comments', () => {
    expect(getTranslationFileSource({})).toEqual(INVALID_FILE_SOURCE);
  });
  it('will return an invalid file source object if the file does not have 3 comments exactly', () => {
    expect(getTranslationFileSource({ comments: [1, 2, 3, 4] })).toEqual(INVALID_FILE_SOURCE);
    expect(getTranslationFileSource({ comments: [1, 2] })).toEqual(INVALID_FILE_SOURCE);
  });
  it('will return an invalid file source object if the file does have the plugin header', () => {
    expect(getTranslationFileSource({
      comments: [
        {
          value: 'a'
        },
        {
          value: 'non json file'
        },
        {
          value: 'passed to the plugin rules'
        }
      ]
    })).toEqual(INVALID_FILE_SOURCE);
  });
  it('will return an invalid file source object if the file does not end with the .json file extension', () => {
    expect(getTranslationFileSource({
      comments: [
        {
          value: 'eslint-plugin-i18n-json'
        },
        {
          value: 'var xyz = "abc";'
        },
        {
          value: '/path/to/file.json'
        }
      ]
    })).toEqual(INVALID_FILE_SOURCE);
  });
  it('for a valid json file will return the source and file path', () => {
    expect(getTranslationFileSource({
      comments: [
        {
          value: 'eslint-plugin-i18n-json'
        },
        {
          value: '{ "a": "value" }'
        },
        {
          value: '/path/to/file.json'
        }
      ]
    })).toEqual(INVALID_FILE_SOURCE);
  });
});
