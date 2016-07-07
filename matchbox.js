/*!
 * Matchbox v1.1.0
 * Match the height of boxes
 * @author Kyle Shevlin
 * MIT License
 */

(function (window, factory) {
  'use strict';

  if ( typeof define === 'function' && define.amd ) {
    define([], factory(window));
  } else if ( typeof exports === 'object' ) {
    module.exports = factory(window);
  } else {
    window.Matchbox = factory(window);
  }
})(window, function factory(window) {
  'use strict';

  // Default settings
  var defaults = {
    initClass: 'js-matchbox-initialized',
    parentSelector: '.js-box',
    childSelector: '.js-match',
    groupsOf: 2,
    breakpoints: []
  };

  //////////////////////////////
  // Utility Functions
  //////////////////////////////

  /**
   * Utility method to extend defaults with user options
   * @access private
   * @param {Object} options - Object with user options keys and values
   * @returns {Object} An object of the merged options
   */
  function extend(options) {
    var default_keys = Object.keys(defaults);

    // Loop through default params
    for (var i = 0; i < default_keys.length; i++) {
      var key = default_keys[i];

      // If options does not have the default key, apply it
      if( !options.hasOwnProperty(key) ) {
        options[key] = defaults[key];
      }
    }

    return options;
  }

  /**
   * Create an array from a nodeList
   * @access private
   * @param {Object} list - NodeList object to be converted into array
   * @returns {Array} Array of DOM nodes
   */
  function arrayFromList(list) {
    return Array.prototype.slice.call(list);
  }

  /**
   * On window scroll and resize, only run events at a rate of 15fps for better performance
   * @access private
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

  //////////////////////////////
  // Private Matchbox Functions
  //////////////////////////////

  /**
   * Adds the initClass to the body element
   * @access private
   * @param {Object} instance - Matchbox instance
   */
  function addInitClass(instance) {
    document.documentElement.classList.add(instance.settings.initClass);
  }

  /**
   * Removes the initClass from the body element
   * @access private
   * @param {Object} instance - Matchbox instance
   */
  function removeInitClass(instance) {
    document.documentElement.classList.remove(instance.settings.initClass);
  }

  /**
   * Gets the boxes that are children of the parent
   * @access private
   * @param {Object} instance - Matchbox instance
   * @returns {Array} - Array of DOM elements
   */
  function getBoxes(instance) {
    var parent = document.querySelector(instance.settings.parentSelector);
    return arrayFromList(parent.querySelectorAll(instance.settings.childSelector));
  }

  /**
   * Reset the height of all boxes to their auto height
   * @access private
   * @param {Object} instance - Matchbox instance
   */
  function resetBoxHeights(instance) {
    var boxes = getBoxes(instance);

    boxes.forEach(function(item, index, array) {
      item.style.height = '';
    });
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
   * Runs the match items function
   * @access private
   * @param {Object} instance - Matchbox instance
   */
  function runMatchItems(instance) {
    var boxes = getBoxes(instance);
    matchItems(boxes, instance.settings.groupsOf);
  }

  /**
   * Gathers the breakpoints and groupsOf values, adds and sorts them from lowest to highest in array
   * @access private
   * @param {Object} instance - Matchbox instance
   * @returns {Array} Sorted array of breakpoints
   */
  function createBreakpoints2DArray(instance) {
    var settingsArray = instance.settings.breakpoints,
        bpArray = [];

    if ( Array.isArray(settingsArray) && !!settingsArray.length ) {

      settingsArray.forEach(function(curVal, index, array) {

        if ( curVal.hasOwnProperty('bp') && curVal.hasOwnProperty('groupsOf') ) {
          var array = [curVal['bp'], curVal['groupsOf']];
          bpArray.push(array);
        }
      });

      bpArray.sort(function(a, b) { return a[0] - b[0]; });
    }

    return bpArray;
  }

  /**
   * Takes created breakpoint 2d array and processes it for use in resize event
   * @access private
   * @param {Object} instance - Matchbox instance
   */
  function handleBreakpoints(instance) {
    var bpArray,
        ww,
        lowestBp = Infinity,
        initGroupsOf = instance.settings._initialGroupsOf,
        groupsOfNow;

    bpArray = createBreakpoints2DArray(instance);
    ww = window.innerWidth;

    if ( !!bpArray.length ) {
      bpArray.forEach(function(curVal, index, array) {
        if ( curVal[0] < lowestBp ) {
          lowestBp = curVal[0];
        }

        var thisBp = curVal[0];
        var nextBp = array[index + 1] !== undefined ? array[index + 1][0] : Infinity;

        if ( ww >= thisBp && ww < nextBp ) {
          groupsOfNow = curVal[1];
        } else if ( ww < lowestBp ) {
          groupsOfNow = initGroupsOf;
        }
      });
    } else {
      groupsOfNow = initGroupsOf;
    }

    instance.groupsOf(groupsOfNow);
  }

  //////////////////////////////
  // Constructor
  //////////////////////////////

  function Matchbox(options) {
    var _this = this,
        opts = options || {};

    _this.settings = extend(opts);
    _this.settings._initialGroupsOf = _this.settings.groupsOf;

    _this._onResize = function() {
      throttle(handleBreakpoints(_this));
    }
  }

  //////////////////////////////
  // Public APIs
  //////////////////////////////

  Matchbox.prototype = {
    /**
     * Destroy the current initialization.
     * @access public
     */
    destroy: function() {
      var _this = this;

      resetBoxHeights(this);
      removeInitClass(this);

      window.removeEventListener('resize', _this._onResize, false);
    },

    /**
     * Initialize Plugin
     * @access public
     * @param {Object} options User settings
     */
    init: function() {
      var _this = this;

      this.destroy();
      addInitClass(this);
      handleBreakpoints(this);

      window.addEventListener('resize', _this._onResize, false);
    },

    /**
     * Update groupsOf option on the fly
     * @access public
     * @param {Integer} number
     */
    groupsOf: function(number) {
      if ( !isNaN(number) ) {
        this.settings.groupsOf = number;

        runMatchItems(this);
      }
    }
  }

  return Matchbox;
});
