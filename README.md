# Matchbox

A simple jQuery plugin for matching the height of boxes.

## Usage

```js
$('.box-of-matches').matchbox({
  selector: '.js-match',
  groups_of: 2
});
```

After adding jQuery and `matchbox.js` to your project, call the `.matchbox()` function on a parent element to the elements you are targeting. The parent element merely serves to allow multiple calls of Matchbox on the page.

Currently, there are two settings that you can update: `selector` and `groups_of`. For the `selector` setting, pass in the class name of the items you wish to match. This defaults to `.js-match` like you see above.

For the `groups_of` setting, pass in the number of items you want to match in each group. The default setting is 2 (You wouldn't need to match heights of a singular item, would you? (It's a paradox, don't think to hard about it or about nested parentheticals)).

## Future

This is simply the MVP (minimum viable product). My plan is to add a `breakpoints` object in the settings to easily allow the `groups_of` setting to be changed per breakpoint. Fair warning, this will be designed to work mobile-first.

Matchbox will also respond to the `resize` event to ensure your boxes stay evenly matched. No point in setting a height and then letting some wrapping inner content break your boxes.

