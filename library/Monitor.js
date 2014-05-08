define('Monitor', [], function() {
  'use strict';
  var Monitor = function(runtime, context, entry, configs) {
    this.runtime = runtime;
    this.context = context;
    this.entry = entry;
    this.configs = configs;
    this.states = {
      'past': undefined,
      'current': context[entry],
      'changes': []
    };
  };

  /**
   * Will be invoked *before* the state got transferred.
   */
  Monitor.prototype.transfer = function(context) {
    // It's possible to give a new context while transferring.
    context = context || this.context;
    var value = context[this.entry];
    if (this.configs.serialized) {
      value = JSON.stringify({'serialized': value});
    }
    this.states.past = value;

    if (this.configs.recording) {
      this.changes.push(value);
    }
  };

  Monitor.prototype.clean = function() {
    this.states.changes.length = 0;
  };

  Monitor.prototype.execute = function(context) {
    this.states.current = context[this.entry];
    return this.states;
  };

  return Monitor;
});
