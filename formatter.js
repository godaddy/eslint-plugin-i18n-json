/*
  Custom eslint formatter for eslint-plugin-i18n-json to allow better error message display.
  Heavily inspired from https://github.com/sindresorhus/eslint-formatter-pretty.
*/

const chalk = require('chalk');
const plur = require('plur');
const logSymbols = require('log-symbols');
const indentString = require('indent-string');

const formatter = (results) => {
  const total = {
    errors: 0,
    warnings: 0
  };

  const outputs = results.map(({ filePath, messages , errorCount, warningCount}) => {
    if(errorCount + warningCount === 0){
      return ''; 
    }
    total.errors += errorCount;
    total.warnings += warningCount;

    const header = `${chalk.underline.white(filePath)}`
    
    messages.sort((a , b) => {
      return b.severity - a.severity; //display errors first
    })

    messagesOutput = messages.map(({ ruleId, severity, message }) => {
      let messageHeader = `${severity === 1 ? `${logSymbols.warning} ${chalk.inverse.yellow('Warning')}` : `${logSymbols.error} ${chalk.inverse.red('Error')}`}`;
      messageHeader += ' ' + chalk.white(`(${ruleId})`);
      return `\n\n${[messageHeader, indentString(message, 2)].join('\n')}`;
    }).join('');

    return [header, messagesOutput].join('\n');
  });

  let formattedReport = outputs.join('\n\n');

  // add in aggregate error and warnings count
  const totalErrorsFormatted = `${logSymbols.error} ${chalk.bold.red(total.errors)} ${chalk.bold.red(plur('Error', total.errors))}`;
  const totalWarningsFormatted = `${logSymbols.warning} ${chalk.bold.yellow(total.warnings)} ${chalk.bold.yellow(plur('Warning', total.warnings))}`

  formattedReport += '\n\n' + `${totalErrorsFormatted}\n${totalWarningsFormatted}`;
  return (total.errors + total.warnings > 0) ? formattedReport : '';
};

module.exports = formatter;