# Webpack Development Example

This example shows how to get eslint-plugin-i18n-json working 
in a project setup to use webpack or webpack dev server.

In order to isolate the i18n json files, notice that we have a separate eslint configuration for all json files in the `i18n` folder. Also we have a separate `eslint-loader` rule for only the i18n json files. This rule also is setup to the formatter exported by eslint-plugin-i18n-json.