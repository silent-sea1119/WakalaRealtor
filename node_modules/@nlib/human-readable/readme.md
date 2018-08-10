# @nlib/human-readable

[![Build Status](https://travis-ci.org/nlibjs/human-readable.svg?branch=master)](https://travis-ci.org/nlibjs/human-readable)
[![Build status](https://ci.appveyor.com/api/projects/status/github/nlibjs/human-readable?branch=mater&svg=true)](https://ci.appveyor.com/project/kei-ito/human-readable/branch/master)
[![codecov](https://codecov.io/gh/nlibjs/human-readable/branch/master/graph/badge.svg)](https://codecov.io/gh/nlibjs/human-readable)
[![dependencies Status](https://david-dm.org/nlibjs/human-readable/status.svg)](https://david-dm.org/nlibjs/human-readable)
[![devDependencies Status](https://david-dm.org/nlibjs/human-readable/dev-status.svg)](https://david-dm.org/nlibjs/human-readable?type=dev)

Converts an integer to a human readable format.

## Install

```
npm install @nlib/human-readable
```

## Usage

```javascript
const console = require('console');
const humanReadable = require('@nlib/human-readable');
console.log(humanReadable(1000));
// 1K
console.log(humanReadable(1000000));
// 1M
```

## Javascript API

humanReadable(*size*: Number, *options*: ?Object]) → String

- *size*: An integer to be converted.
- *options*: configures behavior.
  - *round*: Function. The default value is [Math.round](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round).
  - *base*: Number. The default value is 1000. humanReadable(2048, {base: 1024}) → '2.0K'.
  - *digits*: Number. The default value is 1. humanReadable(2000, {digits: 3}) → '2.000K'.
  - *prefix*: array-like. The default value is ' KMGTPEZY'. humanReadable(2000, {prefix: [, 'Kilo']}) → '2.0Kilo'.
  - *negativePrefix*: array-like. The default value is ' mμnpfazy'. humanReadable(0.02, {negativePrefix: [, 'milli']}) → '20milli'.

## LICENSE

MIT
