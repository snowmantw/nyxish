define('Tracer', ['StateTracer', 'TransferTracer', 'ProgramTracer'],
function(StateTracer, TransferTracer, ProgramTracer) {
  'use strict';
  var Tracer = function(configs) {
    this.configs = configs;
    this.stateTracers = {};
    this.transferTracers = {};
    this.programTracer = null;
  };

  Tracer.prototype.notify = function(category, method, details) {
    switch(category) {
      case 'state':
        if ('start' === method) {
          var { name } = details;
          this.onStateStart(name);
        } else if ('stop' === method) {
          var { name } = details;
          this.onStateStop(name);
        } else if ('define' === method) {
          var {name, timeout, error} = details;
          this.onStateDefine(name, timeout, error);
        }
        break;
    }
  };

  Tracer.prototype.onStateDefine = function(name, timeout, error) {
    timeout = timeout || this.configs.timeout.state;
    error = error || this.configs.error.stateTimeout;
    this.stateTracers[name] = new StateTracer(name, timeout, error);
  };

  Tracer.prototype.onStateStart = function(name) {
    this.stateTracers[name].start(Date.now());
  };

  Tracer.prototype.onStateStop = function(name) {
    this.stateTracers[name].stop(Date.now());
  };

  Tracer.prototype.shutdown = function() {
    Object.keys(this.stateTracers).forEach((name) => {
      this.stateTracers[name].clear();
    });
  };

  return Tracer;
});
