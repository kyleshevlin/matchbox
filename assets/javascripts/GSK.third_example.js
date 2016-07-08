(function() {
  'use strict';

  const thirdExample = new Matchbox({
    initClass: 'js-third-example-initialized',
    parentSelector: '.js-third-example-box',
    breakpoints: [
      { bp: 600, groupsOf: 3 },
      { bp: 1025, groupsOf: 4 },
      { bp: 1350, groupsOf: 5 }
    ]
  });

  GSK.third_example = {
    init() {
      let box = document.querySelector('.js-third-example-box');

      imagesLoaded(box, function() {
        thirdExample.init();
      });
    }
  };
})();
