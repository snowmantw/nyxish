define('BasicTracer', [],
function() {
  'use strict';
  var BasicTracer = function() {};

  BasicTracer.prototype.setup = function() {
    this.configs = {
      type: 'unknown tracing unit',
      name: '',
      timeout: 0,
      timeoutError: true
    };
    this.states = {
      timer: null,
      startTime: null,
      stopTime: null
    };
  };

  BasicTracer.prototype.define = function(name, timeout, error) {
    this.configs.timeout = timeout;
    this.configs.timeoutError = error;
  };

  BasicTracer.prototype.start = function(timestamp) {
    this.states.startTime = timestamp;
    if (0 !== this.configs.timeout) {
      var handler = this.configs.timeoutError ?
                    this.timeoutError.bind(this) :
                    this.timeoutWarning.bind(this);
      this.states.timer = setTimeout(handler, this.configs.timeout);
    }
  };

  BasicTracer.prototype.stop = function(timestamp) {
    this.states.stopTime = timestamp;
    clearTimeout(this.states.timer);
  };

  BasicTracer.prototype.timeoutError = function() {
    throw new Error('(EE) This ' +
      this.configs.type + ' got timeout: ' + this.configs.name);
  };

  BasicTracer.prototype.timeoutWarning = function() {
    console.log('(!!)', 'This ' +
      this.configs.type + ' got timeout: ' + this.configs.name);
  };

  return BasicTracer;
});
