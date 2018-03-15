/*
  Custom eslint formatter for eslint-plugin-i18n-json to allow better error message display.
  Heavily inspired from https://github.com/sindresorhus/eslint-formatter-pretty.
*/

const chalk = require('chalk');
const plur = require('plur');
const logSymbols = require('log-symbols');
const indentString = require('indent-string');
const path = require('path');

const CWD = process.cwd();

const formatter = (results) => {
  const total = {
    errors: 0,
    warnings: 0,
  };
  const outputs = results.map(({
    filePath,
    messages,
    errorCount,
    warningCount,
  }) => {
    if (errorCount + warningCount === 0) {
      return '';
    }
    total.errors += errorCount;
    total.warnings += warningCount;
    const relativePath = path.relative(CWD, filePath);
    const header = `${chalk.underline.white(relativePath)}`;

    messages.sort((a, b) => b.severity - a.severity);

    const messagesOutput = messages.map(({ ruleId, severity, message }) => {
      let messageHeader = `${severity === 1 ? `${logSymbols.warning} ${chalk.inverse.yellow(' WARNING ')}` : `${logSymbols.error} ${chalk.inverse.red(' ERROR ')}`}`;
      messageHeader += ` ${chalk.white(`(${ruleId})`)}`;
      return `\n\n${[messageHeader, indentString(message, 2)].join('\n')}`;
    }).join('');

    return [header, messagesOutput].join('\n');
  }).filter(output => output.trim().length > 0);

  let formattedReport = outputs.join('\n\n');

  // add in aggregate error and warnings count
  const totalErrorsFormatted = `${chalk.bold.red('>')} ${logSymbols.error} ${chalk.bold.red(total.errors)} ${chalk.bold.red(plur('ERROR', total.errors))}`;
  const totalWarningsFormatted = `${chalk.bold.yellow('>')} ${logSymbols.warning} ${chalk.bold.yellow(total.warnings)} ${chalk.bold.yellow(plur('WARNING', total.warnings))}`;

  formattedReport += `\n\n${totalErrorsFormatted}\n${totalWarningsFormatted}`;
  return (total.errors + total.warnings > 0) ? formattedReport : '';
};

module.exports = formatter;
