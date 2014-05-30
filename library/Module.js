define('Module', ['State', 'Monitor', 'Transfer', 'TransferInterfaces'],
function(State, Monitor, Transfer, TransferInterfaces) {
  'use strict';
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
    this.counter = {
      'state': 0,
      'generator': 0
    };
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
    this.counter.state += 1;
    return this.configs.name + '-state-' + this.counter.state;
  };

  Module.prototype.generatorName = function() {
    this.counter.generator += 1;
    return this.configs.name + '-generator-' + this.counter.generator;
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
