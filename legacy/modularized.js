define('StateModuleA', ['NyxishState', 'NyxishTransfer', 'NyxishMonitor'], function(state, transfer, monitor) {
  var Module = function(context) {
    this.context = context;
  };

  Module.prototype.state__init__ = function() {
    (function() {
      state('__init__', function(monitors) {
        this.flag = 0;
        transfer('module-foo', Module.pred);
      });
    }).bind(this.context)();
    return this;
  };

  Module.prototype.stateFoo = function() {
    (function() {
      state('module-foo', function(monitors) {
        //...
        transfer('module-bar', Module.pred);
      });
    }).bind(this.context)();
    return this;
  };

  Module.prototype.stateBar = function() {
    (function() {
      state('module-bar', function(monitors) {
        //...
        transfer('module-foo', Module.pred);
      });
    }).bind(this.context)();
    return this;
  };

  Module.pred = function() {
    return 0 === this.flag % 2;
  };

  return Module;
});
