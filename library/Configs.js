define('Configs', [],
function() {
  'use strict';
  var Configs = function() {
    this.setupTimeout();
    this.setupError();
  };

  Configs.prototype.setupTimeout = function() {
    this.setupCategory('timeout',
      ['transfer', 'program']);

    /**
     * Timeout before each transfer get executed.
     */
    this.timeout[':transfer'] = 0;

    /**
     * Timeout before the program get ended.
     */
    this.timeout[':program'] = 0;
  };

  Configs.prototype.setupError = function() {
    this.setupCategory('error',
      ['programTimeout']);

    /**
     * So that the an error would be thrown if the program
     * timeout, rather than transfer to the __fin__ state.
     */
    this.error[':programTimeout'] = true;
  };

  Configs.prototype.setupCategory = function(category, entries) {
    this[category] = {};
    var subject = this[category];
    entries.forEach((name) => {
      // [':foo'] == default value, set by Configs.
      // ['_foo'] == write-once value, set by user.
      var defaultName = ':' + name,
          writeOnceName = '_' + name;

      Object.defineProperty(subject, name, {
        get: function() {
          if (subject[writeOnceName]) {
            return subject[writeOnceName];
          } else {
            return subject[defaultName];
          }
        },
        set: function(val) {
          if (!subject[defaultName]) {
            subject[defaultName] = val;
          } else if(!subject[writeOnceName]) {
            subject[writeOnceName] = val;
          }
        },
        enumerable: true
      });
    });
  };

  return Configs;
});
