const path = require('path');

module.exports = {
  "root": true, // since this example folder is embedded into the project. just ignore this.
  "extends": [
    "plugin:i18n-json/recommended"
  ],
  rules: {
    // must use absolute path to the module which will return the object structure to compare to.
    "i18n-json/identical-keys": [2, {
      filePath: {
        'login.json': path.resolve('./translations/en-US/login.json'),
        'search-results.json': path.resolve('./translations/en-US/search-results.json'),
        'todos.json': path.resolve('./translations/en-US/todos.json')
      }
    }] 
  }
}
