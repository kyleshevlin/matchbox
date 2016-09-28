// Helper functions
function resetMatches() {
  var matches = Array.prototype.slice.call(document.querySelectorAll('.js-match'));

  matches.forEach(function(curVal, index, array) {
    curVal.style.height = '';
  });
}

function destroyMatches() {
  var matches = Array.prototype.slice.call(document.querySelectorAll('.js-match'));

  matches.forEach(function(curVal, index, array) {
    curVal.parentNode.removeChild(curVal);
  });
}

describe('Matchbox', function() {
  var body = document.body,
      matchbox,
      box;

  beforeEach(function() {
    matchbox = new Matchbox(); // New Matchbox Instance

    // Create Box and add four Matches
    box = document.createElement('div');
    box.className = 'js-box';
    body.appendChild(box);

    for (var i = 1; i <= 4; i++ ) {
      var match = document.createElement('div');
      match.className = 'js-match';
      box.appendChild(match);
    }
  });

  afterEach(function() {
    matchbox = null; // Destroy Matchbox Instance
    box.parentNode.removeChild(box); // Destroy Box
    destroyMatches();
  });

  describe('initialization', function() {
    describe('settings', function() {
      it('should have default settings defined when no object is passed in', function() {
        expect(matchbox.settings).toBeDefined();
        expect(matchbox.settings.initClass).toBeDefined();
        expect(matchbox.settings.parentSelector).toBeDefined();
        expect(matchbox.settings.childSelector).toBeDefined();
        expect(matchbox.settings.groupsOf).toBeDefined();
        expect(matchbox.settings.breakpoints).toBeDefined();
      });

      it('should have settings set when only a partial object is passed in', function() {
        matchbox = new Matchbox({ initClass: '.js-test-init', groupsOf: 4 });

        expect(matchbox.settings.initClass).toBe('.js-test-init');
        expect(matchbox.settings.parentSelector).toBeDefined();
        expect(matchbox.settings.childSelector).toBeDefined();
        expect(matchbox.settings.groupsOf).toBe(4);
        expect(matchbox.settings.breakpoints).toEqual([]);
      });

      it('should deeply nest an object on breakpoints property if passed in', function() {
        matchbox = new Matchbox({ breakpoints: [
            { bp: 768, groupsOf: 3 },
            { bp: 1024, groupsOf: 4 },
            { bp: 1350, groupsOf: 5 }
          ]});

        expect(matchbox.settings.breakpoints).toEqual([
            { bp: 768, groupsOf: 3 },
            { bp: 1024, groupsOf: 4 },
            { bp: 1350, groupsOf: 5 }
          ]);
      });
    });
  });

  describe('.init()', function() {

    afterEach(function() {
      resetMatches();
    });

    it('should add initClass to body', function() {
      matchbox.init();
      expect(body.className).toBe('js-matchbox-initialized');
    });

    it('should set the height of match1 and match2 to be the same', function() {
      var match1 = document.querySelectorAll('.js-match')[0];
      var match2 = document.querySelectorAll('.js-match')[1];
      var div1 = document.createElement('div');
      var div2 = document.createElement('div');

      match1.appendChild(div1);
      match2.appendChild(div2);
      div1.style.height = '100px';
      div2.style.height = '150px';

      matchbox.init();

      expect(match1.style.height === match2.style.height).toBe(true);
      expect(match1.style.height).toBe('150px');
      expect(match2.style.height).toBe('150px');
    });

    it('should not set the height of match2 and match3 to be the same if they are different heights', function() {
      var match2 = document.querySelectorAll('.js-match')[1];
      var match3 = document.querySelectorAll('.js-match')[2];
      var div = document.createElement('div');
      match3.appendChild(div);
      div.style.height = '100px';

      matchbox.init();

      expect(match2.style.height === match3.style.height).toBe(false);
      expect(match2.style.height).toBe('0px');
      expect(match3.style.height).toBe('100px');
    });
  });

  describe('.destroy()', function() {

    afterEach(function() {
      resetMatches();
    });

    it('should reset auto height on matches', function() {
      var match1 = document.querySelectorAll('.js-match')[0];
      var match2 = document.querySelectorAll('.js-match')[1];
      var div1 = document.createElement('div');
      var div2 = document.createElement('div');

      match1.appendChild(div1);
      match2.appendChild(div2);
      div1.style.height = '100px';
      div2.style.height = '150px';

      matchbox.init();
      matchbox.destroy();
      expect(match1.offsetHeight === match2.offsetHeight).toBe(false);
      expect(match1.style.height === match2.style.height).toBe(true);
    });
  });

  describe('.groupsOf()', function() {

    afterEach(function() {
      resetMatches();
    });

    it('should change groupsOf setting', function() {
      matchbox.init();
      matchbox.groupsOf(3);

      expect(matchbox.settings.groupsOf).toBe(3);
    });

    it('should set the heights of match1, 2, and 3 to be the same', function() {
      var match1 = document.querySelectorAll('.js-match')[0];
      var match2 = document.querySelectorAll('.js-match')[1];
      var match3 = document.querySelectorAll('.js-match')[2];
      var div1 = document.createElement('div');
      var div2 = document.createElement('div');
      var div3 = document.createElement('div');

      match1.appendChild(div1);
      match2.appendChild(div2);
      match3.appendChild(div3);
      div1.style.height = '100px';
      div2.style.height = '150px';
      div3.style.height = '200px';

      matchbox.init();
      matchbox.groupsOf(3);

      expect(match1.offsetHeight === match2.offsetHeight).toBe(true);
      expect(match2.offsetHeight === match3.offsetHeight).toBe(true);
      // Third check unnecessary due to the transitive property A -> B; B -> C; A -> C;
    });
  });
});
