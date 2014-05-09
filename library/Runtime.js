define('Runtime', ['State', 'Transfer', 'TransferInterfaces', 'modules/DefaultStates'],
function(State, Transfer, Monitor) {
  'use strict';
  var Runtime = function() {
    if (window.__runtime__) {
      return window.__runtime__;
    }

    window.__runtime__ = this;
    this.setup();
    return this;
  };

  Runtime.prototype.setup = function() {
    this.states = {};
    this.states.module = {
      'active': null,
      'defining': null,
      'modules': {}
    };
  };

  Runtime.prototype.start = function() {
    this.registerModule(new DefaultStates());
  };

  Runtime.prototype.stop = function() {
    this.states.module.modules.forEach((mod) => {
      this.unregisterModule(mod);
    });
  };

  Runtime.registerModule = function(mod) {
    this.states.module.modules[mod.name] = mod;
  };

  Runtime.unregisterModule = function(mod) {
    delete this.states.module.modules[mod.name];
  };

  Runtime.prototype.transfer = function(generator, pred) {
    if ('function' !== typeof generator) {
      return this.transferInterfaces();
    }

    var transfer = new Transfer(this,
          this.states.module.active.context,
          generator,
          pred),
        context = this.states.module.active.context,
        monitors = this.states.monitors[context.__context_id__];

    // Must call this before state transferring.
    Object.keys(monitors).forEach((entry) => {
      monitors[entry].transfer(context);
    });

    transfer.execute();
  };

  Runtime.prototype.transferInterfaces = function() {
    return new TransferInterfaces(this, this.states.module.active.context);
  };

  Runtime.prototype.monitor = function(entry, configs) {
    var monitor = new Monitor(this,
        this.states.module.active.context,
        entry,
        configs);
    this.registerMonitor(monitor);
  };

  Runtime.prototype.registerMonitor = function(monitor) {
    if (!this.states.monitors[monitor.context.__context_id__]) {
      this.states.monitors[monitor.context.__context_id__] = {};
    }
    var registry = this.states.monitors[monitor.context.__context_id__];
    registry[monitor.entry] = monitor;
  };

  Runtime.prototype.unregisterMonitor = function(monitor) {
    if (!this.states.monitors[monitor.context.__context_id__]) {
      return;
    }
    var registry = this.states.monitors[monitor.context.__context_id__];
    delete registry[monitor.entry];
  };

  return Runtime;
});
