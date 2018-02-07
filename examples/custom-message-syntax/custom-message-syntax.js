/*
  I like Pizza Message Syntax Validator.


  This is a custom message syntax validator
  it must throw a SyntaxError (or any Error) when a message has
  invalid syntax.

  You can even import a 3rd party library to validate the syntax. 
  Feel free to make a Pull Request also :)
*/

module.exports = (message) => {
  if(message.split(/\s/).shift() !== 'PIZZA'){
    throw new SyntaxError('PIZZA word must prepended to each message. E.g, PIZZA message');
  }
};