(function() {
  'use strict';

  const secondExample = new Matchbox({
    initClass: 'js-second-example-initialized',
    parentSelector: '.js-second-example-box',
    groupsOf: 3
  });
  let isMatched = false;

  function secondExampleToggle() {
    let toggle = document.querySelector('.js-second-example-toggle');

    function toggleCallback(e) {
      isMatched = !isMatched;
      isMatched ? secondExample.init() : secondExample.destroy();
    }

    toggle.addEventListener('click', toggleCallback, false);
  }

  GSK.second_example = {
    init() {
      secondExampleToggle();
    }
  };
})();
