define('StateTracer', [],
function() {
  'use strict';
  var StateTracer = function(name) {
    this.configs = {
      name: name,
      timeout: 0,
      timeoutError: true
    };
    this.states = {
      timer: null,
      startTime: null,
      stopTime: null
    };
  };

  StateTracer.prototype.start = function(timestamp, timeout, error) {
    this.configs.timeout = timeout;
    this.configs.timeoutError = error;
    this.states.startTime = timestamp;
    if (0 !== timeout) {
      var handler = error ? this.timeoutError.bind(this) :
                    this.timeoutWarning.bind(this);
      this.states.timer = setTimeout(handler, timeout);
    }
  };

  StateTracer.prototype.stop = function(timestamp) {
    this.states.stopTime = timestamp;
    clearTimeout(this.states.timer);
  };

  StateTracer.prototype.timeoutError = function() {
    throw new Error('(EE) This state got timeout: ' + this.configs.name);
  };

  StateTracer.prototype.timeoutWarning = function() {
    console.log('(!!) This state got timeout: ' + this.configs.name);
  };

  return StateTracer;
});
