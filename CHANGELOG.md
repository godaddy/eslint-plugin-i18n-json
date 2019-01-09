# Changelog

All notable changes to this project will be documented in this file.

The format is loosely based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [2.4.1] - 2018-01-08

### Fixed

- update to make plugin compatible when used within a file watching service. e.g) webpack dev server
- new example project showcasing how to configure the plugin with webpack dev server.
- Related PRs
  - [#21](https://github.com/godaddy/eslint-plugin-i18n-json/pull/21) - Thanks [@maccuaa](https://github.com/maccuaa)
  - [#23](https://github.com/godaddy/eslint-plugin-i18n-json/pull/23)

## [2.4.0] - 2018-07-01

### Added

- **New plugin setting:** `i18n-json/ignore-keys`. Takes a list of key paths (case sensitive) to ignore when checking syntax and doing key structure comparisons. Only acknowledged by the `identical-keys` and `valid-syntax` rules. See README for more details on use.
- new example project for `i18n-json/ignore-keys` to showcase usage.
- Related PRs
  - [#17](https://github.com/godaddy/eslint-plugin-i18n-json/pull/17)

## [2.3.0] - 2018-05-04

### Changed

- **sorted-keys:** converted the sort feature into an actual eslint rule (backwards compatible with <= 2.2.0). See README for more details on use.
- May the 4th be with you! :)
- Related PRs
  - [#13](https://github.com/godaddy/eslint-plugin-i18n-json/pull/13)

## [2.2.0] - 2018-04-30

### Fixed

**sorted-keys:** prevent eslint from failing when `--fix` is not passed.
- Related PRs
  - [#11](https://github.com/godaddy/eslint-plugin-i18n-json/pull/11) - Thanks [@Nainterceptor](https://github.com/Nainterceptor)

### Changed

**identical-keys:** minimized diffing output.
- Related PRs
  - [#6](https://github.com/godaddy/eslint-plugin-i18n-json/pull/6).
Thanks @tvarsis
