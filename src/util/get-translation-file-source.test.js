const getTranslationFileSource = require('./get-translation-file-source');

const INVALID_FILE_SOURCE = {
  valid: false,
  source: null,
  sourceFilePath: null
};

describe('#getTranslationFileSource', () => {
  it('will return an invalid file source object if the file\'s extension is not .json', () => {
    const context = {
      getFilename: jest.fn().mockReturnValueOnce('file.js')
    };
    const node = {};
    expect(getTranslationFileSource({ context, node })).toEqual(INVALID_FILE_SOURCE);
  });
  it('will return an invalid file source object if parsed file ast node does not have a comments property', () => {
    const context = {
      getFilename: jest.fn().mockReturnValueOnce('file.json')
    };
    const node = {};
    expect(getTranslationFileSource({ context, node })).toEqual(INVALID_FILE_SOURCE);
  });
  it('will return an invalid file source object if parsed file ast node has less than 2 comments', () => {
    const context = {
      getFilename: jest.fn().mockReturnValueOnce('file.json')
    };
    const node = {
      comments: [
        {
          value: 'comment 1'
        }
      ]
    };
    expect(getTranslationFileSource({ context, node })).toEqual(INVALID_FILE_SOURCE);
  });
  it('will return a valid trimmed file source if the source is a json file and it was processed by plugin preprocessor', () => {
    const context = {
      getFilename: jest.fn().mockReturnValueOnce('file.json')
    };
    const node = {
      comments: [
        {
          value: ' json source '
        },
        {
          value: ' path/to/file.json '
        }
      ]
    };
    expect(getTranslationFileSource({ context, node })).toEqual({
      valid: true,
      source: 'json source',
      sourceFilePath: 'path/to/file.json'
    });
  });
});
