(function() {
  'use strict';

  const thirdExample = new Matchbox({
    initClass: 'js-third-example-initialized',
    parentSelector: '.js-third-example-box'
  });

  function responsiveGroupsOf() {
    var ww = window.innerWidth;

    if ( ww >= 1350 ) {
      thirdExample.groupsOf(5);
    } else if ( ww >= 1025 ) {
      thirdExample.groupsOf(4);
    } else if ( ww >= 600 ) {
      thirdExample.groupsOf(3);
    } else {
      thirdExample.groupsOf(2);
    }
  }

  GSK.third_example = {
    init() {
      let box = document.querySelector('.js-third-example-box');

      imagesLoaded(box, function() {
        thirdExample.init();
        responsiveGroupsOf(); // Fire it once to get the groupsOf setting correct;
      });

      window.addEventListener('resize', responsiveGroupsOf, false);
    }
  };
})();
