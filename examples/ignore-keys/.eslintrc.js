const path = require('path');

module.exports = {
  root: true, // since this example folder is embedded into the project. just ignore this.
  extends: [
    'plugin:i18n-json/recommended'
  ],
  settings: {
    /*
      None of the key paths listed below
      will be checked for valid i18n syntax
      nor used in the identical-keys rule comparison.
      (if the key path points to an object, the object is ignored)
    */
    'i18n-json/ignore-keys': [
      'translationMetadata', 
      'login.form.inProgressTranslationKey'
    ]
  },
  rules: {
    // option for this rule the absolute path to the comparision file the plugin should require. 
    'i18n-json/identical-keys': [2, {
      // each file's key structure compared with this file.
      filePath: path.resolve('./translations/en-US/index.json')
    }] 
  }
}
