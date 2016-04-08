/*!
 * Matchbox v1.0.0
 * Match the height of boxes
 * MIT License
 */

(function() {
  'use strict';

  /**
   * Matchbox
   * @constructor
   * @param {Object}
   */
  this.Matchbox = function() {
    var defaults = {
      selector: '.js-match',
      groupsOf: 2
    };

    if ( arguments[0] && typeof arguments[0] === "object" ) {
      this.options = extendDefaults(defaults, arguments[0]);
    } else {
      this.options = defaults;
    }
  }

  /**
   * Matchbox init method; Initializes Matchbox with options passed into the new Constructor
   * @access public
   */
  Matchbox.prototype.init = function() {
    matchItems(createArrayFromNodesList(this.options.selector), this.options.groupsOf);
  }

  /**
   * Update groupsOf option on the fly
   * @access public
   * @param {Integer} number
   */
  Matchbox.prototype.groupsOf = function(number) {
    if ( !isNaN(number) ) {
      this.options.groupsOf = number;
      matchItems(createArrayFromNodesList(this.options.selector), this.options.groupsOf);
    }
  }

  // Private Methods

  /**
   * Create an array from a nodeList
   * @access private
   * @param {String} selector - Selector with which to query the DOM and create nodeList
   * @returns {Array} Array of DOM nodes
   */
  function createArrayFromNodesList(selector) {
    return Array.prototype.slice.call(document.querySelectorAll(selector));
  }

  /**
   * Get the next set of items to process
   * @access private
   * @param {Array} items - Array of items
   * @param {Integer} number - Size of next group of items
   * @returns {Array} Array of the next set of items
   */
  function getNextItems(items, number) {
    return items.slice(0, number);
  }

  /**
   * Get the rest of the items to process
   * @access private
   * @param {Array} items - Array of items
   * @param {Integer} number - Size of group of items
   * @returns {Array} Array of the rest of the items
   */
  function getRestOfItems(items, number) {
    return items.length <= number ? items : items.slice((items.length - number) * -1);
  }

  /**
   * Get the height of the tallest item in the set
   * @access private
   * @param {Array} items - Array of items
   * @returns {Integer} Height of tallest item
   */
  function getTallestHeight(items) {
    var tallestHeight = 0;

    items.forEach(function(item, index, array) {
      // Remove any previously set height
      item.style.height = '';

      if ( item.offsetHeight > tallestHeight ) {
        tallestHeight = item.offsetHeight;
      }
    });

    return tallestHeight;
  }

  /**
   * Set the same height on each item in the set
   * @access private
   * @param {Array} items - Array of items
   * @param {Number|String} height - Height that each item will be set to
   */
  function setSameHeight(items, height) {
    if ( !isNaN(height) ) {
      height = height + 'px';
    }

    items.forEach(function(item, index, array) {
      item.style.height = height;
    });
  }

  /**
   * Cycle through all groups of items, getting tallest height and setting that height on all items in that group
   * @access private
   * @param {Array} items - Array of items
   * @param {Integer} number - Number of items in each group
   */
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

    if ( typeof restOfItems !== 'undefined' && restOfItems.length ) {
      matchItems(restOfItems, number);
    }
  }

  /**
   * Utility method to extend defaults with user options
   * @access private
   * @param {Object} source - Object with default keys and values
   * @param {Object} properties - Object with user options keys and values
   * @returns {Object} An object of the merged options
   */
  function extendDefaults(source, properties) {
    var property;

    for (property in properties) {
      if ( properties.hasOwnProperty(property) ) {
        source[property] = properties[property];
      }
    }
    return source;
  }
}());
