define('Runtime', ['Module', 'modules/DefaultStates'],
function(Module, DefaultStates) {
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

  Runtime.prototype.registerModule = function(mod) {
    this.states.module.modules[mod.name] = mod;
  };

  Runtime.prototype.unregisterModule = function(mod) {
    delete this.states.module.modules[mod.name];
  };

  Runtime.prototype.transfer = function(generator, pred) {
    var module = this.states.module.active;
    if ('function' !== typeof generator) {
      return module.transferInterfaces();
    }
    module.transfer(generator, pred);
  };

  Runtime.prototype.monitor = function() {
    this.states.module.active.monitor(entry, configs);
  };

  Runtime.prototype.responseModuleTransfer = function(targetName) {
    var module = this.states.module.active,
        target = this.states.module.modules[targetName];
    if (!target) {
      throw new Error("Transfer to a non-existing module.");
    }
    // We would keep the same monitors in modules. The active module
    // should own the newest monitors can can overwrite the olds.
    //
    // If module has other cross-module information like this, we would
    // do the transferring here, too.
    Object.keys(module.monitors).forEach((entry) => {
      target.module.monitors[entry] = module.monitors[entry];
    });
    return target;
  };

  Runtime.prototype.request = function(category, method, details) {
    if('module' === category) {
      switch(method) {
        case 'transfer':
          var {from, to, callback} = details,
              result = this.responseModuleTransfer(to);
          callback(result);
        break;
      }
    }
  };

  Runtime.prototype.infect = function() {
    window['monitor'] = this.monitor.bind(this);
    window['transfer'] = this.transfer.bind(this);
    window['def'] = this.def.bind(this);
  };

  return Runtime;
});
