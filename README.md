# Matchbox

A simple JavaScript plugin to match the height of boxes.

## Usage

```js
var matchbox = new Matchbox({
  initClass: 'js-matchbox',
  selector: '.js-match',
  groupsOf: 2
});

matchbox.init();
```

After adding `matchbox.js` to your project, instantiate a new `Matchbox`, passing in your options object as the first argument, and call the `.init()` function on your Matchbox instance.

## Options

| Option Name | Type | Description | Default Value |
|---|---|---|---|
| initClass | String | class name set on `body` on init | 'js-matchbox' |
| selector | String | class or id selector | '.js-match' |
| groupsOf | Integer | Size of groups to process for matches | 2 |

## Public Methods

| Method Name | Description |
|---|---|
| init() | initializes the Matchbox instance with |
| groupsOf(number) | Quickly modify the groupsOf setting on a Matchbox instance |
| destroy() | destroys the Matchbox instance and resets all applied heights |

## Future

This is simply the MVP (minimum viable product). My plan is to add a `breakpoints` object in the options to easily allow the `groupsOf` setting to be changed per breakpoint. Fair warning, this will be designed to work mobile-first.

Matchbox will also respond to the `resize` event to ensure your boxes stay evenly matched. No point in setting a height and then letting some wrapping inner content break your boxes.

