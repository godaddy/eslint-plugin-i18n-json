# Changelog

All notable changes to this project will be documented in this file.

The format is loosely based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [3.0.0] - 2020-08-18 - MAJOR BUMP

- **security:** Bump intl-messageformat-parser from v3 to v5 due to [CVE-2020-7660](https://nvd.nist.gov/vuln/detail/CVE-2020-7660)
- Major bump as a precaution, due to `intl-messageformat-parser` getting bumped from v3 to v5.
- Related PRs
  - [Issue #36](https://github.com/godaddy/eslint-plugin-i18n-json/pull/36) - Thanks Michael Desantis - Intertek Alchemy LP.


## [2.4.3] - 2019-11-05

### Fixed

- ignore non json files which are passed to the plugin rules.
- Related PRs/Issues
  - [Issue #26](https://github.com/godaddy/eslint-plugin-i18n-json/issues/26)
  - [PR #27](https://github.com/godaddy/eslint-plugin-i18n-json/pull/27) - Thanks [@unlight](https://github.com/unlight)


## [2.4.2] - 2019-08-30

### Fixed

**valid-message-syntax:** upgrade `intl-messageformat-parser` to `^3.0.7` for parsing fixes.
- Related PRs
  - [#25](https://github.com/godaddy/eslint-plugin-i18n-json/pull/25) - Thanks [@darkyndy](https://github.com/darkyndy)

## [2.4.1] - 2018-01-08

### Fixed

- update to make plugin compatible when used within a file watching service. e.g) webpack dev server.
- new example project showcasing how to configure the plugin with webpack development.
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
