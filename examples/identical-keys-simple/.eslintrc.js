const path = require('path');

module.exports = {
  "root": true, // since this example folder is embedded into the project. just ignore this.
  "extends": [
    "plugin:i18n-json/recommended"
  ],
  rules: {
    // option for this rule the absolute path to the comparision file the plugin should require. 
    "i18n-json/identical-keys": [2, {
      // each file's key structure compared with this file.
      filePath: path.resolve('./translations/en-US/index.json')
    }]
  }
}
