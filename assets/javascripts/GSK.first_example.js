(function() {
  'use strict';

  const firstExample = new Matchbox({
    initClass: 'js-first-example-initialized',
    parentSelector: '.js-first-example-box',
    groupsOf: 3
  });
  let isMatched = false;

  function firstExampleToggle() {
    let toggle = document.querySelector('.js-first-example-toggle');

    function toggleCallback(e) {
      isMatched = !isMatched;
      isMatched ? firstExample.init() : firstExample.destroy();
    }

    toggle.addEventListener('click', toggleCallback, false);
  }

  GSK.first_example = {
    init() {
      firstExampleToggle();
    }
  };
})();
