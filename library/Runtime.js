define('Runtime', ['Configs', 'Module'],
function(Configs, Module) {
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
      'modules': {},
      'infected': false
    };
    this.configs = new Configs();
  };

  Runtime.prototype.start = function(bootstrapModule) {
    this.registerModule(bootstrapModule);
    this.states.module.active = bootstrapModule;
    return this;
  };

  Runtime.prototype.stop = function() {
    this.states.module.modules.forEach((mod) => {
      this.unregisterModule(mod);
    });
    return this;
  };

  Runtime.prototype.registerModule = function(mod) {
    this.states.module.modules[mod.name] = mod;
  };

  Runtime.prototype.unregisterModule = function(mod) {
    delete this.states.module.modules[mod.name];
  };

  Runtime.prototype.responseModuleTransfer = function(targetName) {
    var module = this.states.module.active,
        target = this.states.module.modules[targetName];
    if (!target) {
      throw new Error("Transfer to a non-existing module: " + targetName);
    }
    // We would keep the same monitors in modules. The active module
    // should own the newest monitors can can overwrite the olds.
    //
    // If module has other cross-module information like this, we would
    // do the transferring here, too.
    Object.keys(module.monitors).forEach((entry) => {
      target.monitors[entry] = module.monitors[entry];
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

  /**
   * Will return TransferInterfaces if the first argument is not an
   * function (state generator).
   */
  Runtime.prototype.transfer = function(generator, pred) {
    var module = this.states.module.active;
    if ('function' !== typeof generator) {
      return module.transferInterfaces();
    }
    module.transfer(generator, pred);
  };

  /**
   * Has state or not. Only concerns the inner-module query according
   * to the current active module.
   */
  Runtime.prototype.has = function(name) {
    return !!this.states.module.active.states[name];
  };

  Runtime.prototype.state = function(name) {
    return this.states.module.active.states[name];
  };

  Runtime.prototype.moduleName = function() {
    return 'module-' + Date.now();
  };

  Runtime.prototype.monitor = function() {
    this.states.module.active.monitor(entry, configs);
  };

  Runtime.prototype.def = function(content) {
    return this.states.module.defining.define(content);
  };

  Runtime.prototype.module = function(context) {
    context = context || self;
    context.configs = this.configs;
    var name = this.moduleName(),
        module = new Module(this, context, name);
    this.registerModule(module);
    this.states.module.defining = module;
    return module;
  };

  Runtime.prototype.infect = function() {
    if (this.states.infected) {
      return this;
    }
    window.monitor = this.monitor.bind(this);
    window.transfer = this.transfer.bind(this);
    window.def = this.def.bind(this);
    window.mod = this.module.bind(this);
    window.instance = () => this.states.module.active;
    this.states.infected = true;
    return this;
  };

  /**
   * Bootstrap the program.
   */
  Runtime.prototype.bootstrap = function() {
    this.transfer(this.states.module.active.__init__,
      () => {return true;});
  };

  /**
   * The program has been shutdown.
   * This should be called within the __fin__ state.
   */
  Runtime.prototype.shutdown = function(context) {
    this.debug('(II)',
      'The program has been shut down with the final context ',
      context);
  };

  Runtime.prototype.debug = function() {
    console.log.apply(console, arguments);
  };

  return Runtime;
});
