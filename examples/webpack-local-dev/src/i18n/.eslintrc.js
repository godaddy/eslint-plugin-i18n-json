const path = require('path');

module.exports = {
  root: true, // this eslint configuration only applies to this folder.
  extends: [
    'plugin:i18n-json/recommended'
  ],
  rules: {
    // option for this rule the absolute path to the comparision file the plugin should require. 
    'i18n-json/identical-keys': [2, {
      // each file's key structure compared with this file.
      filePath: path.resolve('./src/i18n/en-US.json')
    }] 
  }
}
