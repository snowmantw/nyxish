define('State', [], function() {
  'use strict';
  var State = function(runtime, context, name, content) {
    this.setup(runtime, context, name, content);
  };

  State.prototype.setup = function(runtime, context, name, content) {
    this.runtime = runtime;
    this.context = context;
    this.content = content;
    this.configs = {};
    this.configs.name = name;
  };

  State.prototype.execute = function() {
    this.content.call(this.context);
    this.notifyExecuted();
  };

  State.prototype.notifyExecuted = function() {
    this.runtime.notify('state', 'done', {
      'name': this.configs.name
    });
  };

  return State;
});
