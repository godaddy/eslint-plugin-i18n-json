const icuMessageParser = require('@formatjs/icu-messageformat-parser');

// a message validator should throw if there is any error
module.exports = (message) => {
  icuMessageParser.parse(message);
};
