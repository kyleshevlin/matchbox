;(function($) {

  $.fn.matchbox = function(options) {

    // Default Settings
    var settings = $.extend({
      selector: '.js-match',
      groups_of: 2
    }, options);

    function getNextItems(items, number) {
      return items.slice(0, number);
    }

    function getRestOfItems(items, number) {
      return items.length <= number ? items : items.slice((items.length - number) * -1);
    }

    function getTallestHeight(items) {
      var tallestHeight = 0;

      items.each(function() {
        // Clear previous height
        $(this).css('height', '');

        if ( $(this).outerHeight() > tallestHeight ) {
          tallestHeight = $(this).outerHeight();
        }
      });

      return tallestHeight;
    }

    function setSameHeight(items, height) {
      items.each(function() {
        $(this).css('height', height);
      });
    }

    function matchItems(items, number) {
      if ( items.length === 0 ) { return; }

      var nextItems,
          restOfItems,
          tallestHeight;

      nextItems = getNextItems(items, number);

      if ( items.length > number ) {
        restOfItems = getRestOfItems(items, number);
      }

      tallestHeight = getTallestHeight(nextItems);

      setSameHeight(nextItems, tallestHeight);

      // If there are more items, match the next batch
      if ( typeof restOfItems !== 'undefined' && restOfItems.length ) {
        matchItems(restOfItems, number);
      }
    }

    matchItems($(this).find($(settings.selector)), settings.groups_of);

    return this;
  };

}(jQuery));
