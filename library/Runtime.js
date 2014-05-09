define('Runtime', ['State', 'Transfer', 'TransferInterfaces', 'modules/DefaultStates'],
function(State, Transfer, Monitor) {
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
        this.states.module.active.context(),
        generator,
        pred);
    transfer.execute();
  };

  Runtime.prototype.transferInterfaces = function() {
    return new TransferInterfaces(this, this.states.module.active.context());
  };

  return Runtime;
});
