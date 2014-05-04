define('StateModuleA',
['NyxishState', 'NyxishTransfer', 'NyxishMonitor', 'NyxishModule', 'NyxishModuleDef'],
function(state, transfer, monitor, mod, def) {
  var Module = mod(this);
  Module.prototype.stateFoo =
  def(function(monitors) {
    //...

    // ERROR: no instance, no state method...
    // So we need to:
    var instance = new Module(this);
    transfer(instance.stateFoo, Module.pred);
  });

  Module.pred = function() {
    return 0 === this.flag % 2;
  };
});

(function() {
  var mod = function(context) {
    // Give the context object ID.
    context.__context_id__ = Date.now();
    return function() {};
  };
  var def = function(content) {
    var stateName = Date.now();
    var result = () => {
      // When the result method got executed, it needs to define a new state.
      var state = new State(this.context, stateName, content);
    };
    result.__name__ = stateName;
    result.__context_id__ = this.context.__context_id__;
    return result;
  };

  var transfer = function(stateMethod) {
    if (!this.STATES.has(stateMethod.__name__)) {
      // Define it on the fly.
      stateMethod();
      // If we treat the 'this' as context.
    } else if(stateMethod.__context_id__ !== this.__context_id__) {
      // overwrite the old method while we need it in another different context.
      staetMethod();
    }

    // Do transfer according to the stateMethod.__name__
  };
})();
