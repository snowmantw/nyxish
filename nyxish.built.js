define('Configs', [],
function() {
  
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

define('State', [], function() {
  
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

define('Monitor', [], function() {
  
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

define('Transfer', [], function() {
  
  var Transfer = function(runtime, context, generator, pred) {
    this.runtime = runtime;
    this.generator = generator;
    this.context = context;
    this.pred = pred;
  };

  Transfer.prototype.execute = function() {
    var targetState = null,
        predResult = this.pred.call(this.context);

    if (!predResult) {
      return false;
    }

    if (!this.runtime.has(this.generator.stateName)) {
      targetState = this.generator();
    } else {
      targetState = this.runtime.state(this.generator.stateName);
    }
    targetState.execute();
    return true;
  };

  return Transfer;
});

(define('TransferInterfaces', ['Transfer'], function(Transfer) {
  
  var TransferInterfaces = function(runtime, context) {
    this.runtime = runtime;
    this.context = context;
  };

  TransferInterfaces.prototype.defer = function(generator, pred) {
    var transfer = new Transfer(this.runtime, this.context,
      generator, pred);

    return transfer.execute.bind(transfer);
  };

  return TransferInterfaces;
}));

define('Module', ['State', 'Monitor', 'Transfer', 'TransferInterfaces'],
function(State, Monitor, Transfer, TransferInterfaces) {
  
  var Module = function(runtime, context, name) {
    this.setup();
    this.runtime = runtime;
    this.context = context;
    this.configs.name = name;
  };

  Module.prototype.setup = function() {
    this.runtime = null;
    this.context = null;
    this.states = {};
    this.monitors = {};
    this.methods = {};
    this.configs = {
      'name': undefined
    };
  };

  /**
   * Return the state generator.
   *
   * The generator would have 'methodName', which is its own unique name, the
   * 'stateName', which is the target state should be generated by the method,
   * and the 'moduleName', which is the module's name.
   *
   * Some of these attributes are for cross-module transferring.
   */
  Module.prototype.define = function(content) {
    var stateName = this.stateName(),
        method = () => {
          var state = new State(this.runtime, this.context, stateName, content);
          this.states[stateName] = state;
          return state;
        };
    method.methodName = this.generatorName();
    method.stateName = stateName;
    method.moduleName = this.configs.name;
    this.methods[method.methodName] = method;
    return method;
  };

  /**
   * Transfer would do the transferring:
   *
   * 1. Query the runtime to get the state according to generator
   * 2. The runtime will check it with the active module, and then the transfer
   * 2.1. If the state has been registered, execute its content with the content
   * 2.2. If the state has not been registered, the transfer would generate it
   *
   * This may concern the cross-module (therefore the cross-context, too) issue.
   * If the state it queried is not a part of this module, it would need to do
   * the module transferring before the above steps.
   */
  Module.prototype.transfer = function(generator, pred) {
    if (generator.moduleName !== this.configs.name) {
      this.requestModuleTransfer(generator.moduleName,
      (targetModule) => {
        targetModule.transfer(generator, pred);
      });
    } else {
      var transfer = new Transfer(this.runtime, this.context, generator, pred);
      transfer.execute();
    }
  };

  Module.prototype.transferInterfaces = function() {
    var transferInterfaces = new TransferInterfaces(this.runtime, this.context);
    return transferInterfaces;
  };

  Module.prototype.monitor = function(entry, configs) {
    var monitor = new Monitor(this.runtime, this.context, entry, configs);
    this.monitors[entry] = monitor;
  };

  Module.prototype.stateName = function() {
    return this.configs.name + '-state-' + Date.now();
  };

  Module.prototype.generatorName = function() {
    return this.configs.name + '-generator-' + Date.now();
  };

  Module.prototype.requestModuleTransfer = function(to, cb) {
    this.runtime.request('module', 'transfer', {
      'from': this.configs.name,
      'to': to,
      'callback': cb
    });
  };

  return Module;
});

define('Runtime', ['Configs', 'Module'],
function(Configs, Module) {
  
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

  Runtime.prototype.notify = function(category, method, details) {
    if ('state' === category) {
      switch(method) {
        case 'done':
          this.onStateDone(details);
          break;
      }
    }
  };

  Runtime.prototype.onStateDone = function(details) {
    var {name} = details;
    // TODO
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
    var generator = this.states.module.defining.define(content);
    return generator();
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

