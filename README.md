# Matchbox

[![Build Status](https://travis-ci.org/kyleshevlin/matchbox.svg?branch=master)](https://travis-ci.org/kyleshevlin/matchbox)

A simple JavaScript plugin to match the height of boxes.

## Installation

Matchbox is available via Bower.

```
$ bower install matchboxjs
```

## Usage

```js
var matchbox = new Matchbox({
  initClass: 'js-matchbox-initialized',
  parentSelector: '.js-box',
  childSelector: '.js-match',
  groupsOf: 2,
  breakpoints: []
});

matchbox.init();
```

After adding `matchbox.js` to your project, instantiate a new `Matchbox`, passing in your options object as the first argument, and call the `.init()` function on your Matchbox instance.

## Options

| Option Name | Type | Description | Default Value |
|---|---|---|---|
| initClass | String | class name set on `body` on init | 'js-matchbox-initialized' |
| parentSelector | String | class or id selector | '.js-box' |
| childSelector | String | class or id selector | '.js-match' |
| groupsOf | Integer | Size of groups to process for matches | 2 |
| breakpoints | Array | Array of objects; each object must have a `bp` and a `groupsOf` property. | [] |

## Public Methods

| Method Name | Description |
|---|---|
| init() | initializes the Matchbox instance with |
| groupsOf(number) | Quickly modify the groupsOf setting on a Matchbox instance |
| destroy() | destroys the Matchbox instance and resets all applied heights |

## Behavior of Breakpoints

Matchbox is designed to behave mobile first with no option (currently) to operate otherwise. If you would like a Matchbox instance to automatically update per breakpoint, add objects to the `breakpoints` array at initialization like so:

```javascript
var matchbox = new Matchbox({
  breakpoints: [
    { bp: 480, groupsOf: 3 },
    { bp: 768, groupsOf: 4 }
  ]
});

matchbox.init();
```

Matchbox will sort your breakpoints from smallest to lowest, and then detect when the `window.innerWidth` is greater than or equal to your breakpoint but less than your next breakpoint. It will utilize Matchbox's `groupsOf` method to then update your Matchbox instance.

## Contributing

If you would like to contribute to Matchbox, please submit an issue with your desired enhancements or fixes first. After a course of action has been decided, feel free to fork the repo and submit pull requests. They will be looked at and evaluated timely.

## License

Copyright (c) 2016 Kyle Shevlin

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

