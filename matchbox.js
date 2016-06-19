/*!
 * Matchbox v1.0.1
 * Match the height of boxes
 * @author Kyle Shevlin
 * MIT License
 */

(function (root, factory) {
  if ( typeof define === 'function' && define.amd ) {
    define([], factory(root));
  } else if ( typeof exports === 'object' ) {
    module.exports = factory(root);
  } else {
    root.Matchbox = factory(root); // @todo rename plugin
  }
})(typeof global !== "undefined" ? global : this.window || this.global, function(root) {
  'use strict';

  //////////////////////////////
  // Variables
  //////////////////////////////

  var supports = !!document.querySelector && !!root.addEventListener; // Feature test
  var settings;

  // Default settings
  var defaults = {
    initClass: 'js-matchbox',
    selector: '.js-match',
    groupsOf: 2
  };

  //////////////////////////////
  // Constructor
  //////////////////////////////

  function Matchbox(options) {
    this.initClass;
    this.selector;
    this.groupsOf;
    this.settings = setSettings(defaults, options || {});
    this.init();
  }

  //////////////////////////////
  // Utility Functions
  //////////////////////////////

  /**
   * Utility method to extend defaults with user options
   * @access private
   * @param {Object} defaultOptions - Object with default keys and values
   * @param {Object} userOptions - Object with user options keys and values
   * @returns {Object} An object of the merged options
   */
  function extendDefaults(defaultOptions, userOptions) {
    var option;

    for (option in userOptions) {
      if ( userOptions.hasOwnProperty(option) ) {
        defaultOptions[option] = userOptions[option];
      }
    }

    return defaultOptions;
  }

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
   * On window scroll and resize, only run events at a rate of 15fps for better performance
   * @private
   * @param  {Function} callback - function to be throttled
   */
  function throttle(callback) {
    var wait = false;

    return function() {
      if ( !wait ) {
        callback.call();
        wait = true;

        setTimeout(function () {
          wait = false;
        }, 66);
      }
    }
  }

  function addInitClass() {
    document.documentElement.classList.add( settings.initClass );
  }

  function removeInitClass() {
    document.documentElement.classList.remove( settings.initClass );
  }

  function setSettings(defaults, options) {
    settings = extendDefaults( defaults, options );
  }

  function resetSettings() {
    settings = null;
  }

  function resetBoxHeights() {
    var boxes = createArrayFromNodesList(settings.selector);

    boxes.forEach(function(item, index, array) {
      item.style.height = '';
    });
  }

  //////////////////////////////
  // Private Matchbox Functions
  //////////////////////////////

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

  function runMatchItems() {
    matchItems(createArrayFromNodesList(settings.selector), settings.groupsOf);
  }

  //////////////////////////////
  // Public APIs
  //////////////////////////////

  /**
   * Destroy the current initialization.
   * @public
   */
  Matchbox.prototype.destroy = function() {
    if ( !settings ) return;

    resetBoxHeights();
    removeInitClass();
    resetSettings();

    window.removeEventListener('resize', throttle(runMatchItems));
  };

  /**
   * Initialize Plugin
   * @public
   * @param {Object} options User settings
   */
  Matchbox.prototype.init = function(options) {
    if ( !supports ) return;

    this.destroy();
    setSettings(defaults, options || {});
    addInitClass();
    matchItems(createArrayFromNodesList(settings.selector), settings.groupsOf);

    window.addEventListener('resize', throttle(runMatchItems));
  };

  /**
   * Update groupsOf option on the fly
   * @access public
   * @param {Integer} number
   */
  Matchbox.prototype.groupsOf = function(number) {
    if ( !settings ) return;

    if ( !isNaN(number) ) {
      settings.groupsOf = number;

      matchItems(createArrayFromNodesList(settings.selector), settings.groupsOf);
    }
  }

  return Matchbox;
});
