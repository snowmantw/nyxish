define('NyxishModule',
['NyxishState', 'NyxishTransfer', 'NyxishMonitor', 'NyxishRuntime'],
function(State, Transfer, Monitor, Runtime) {
  var Module = function(context) {
    context.__context_id__ = Date.now();
    return function() {
      this.context = context;
    };
  };

  Module.def = function(content) {
    var stateName = Date.now(),
        result = () => {
          // When the result method got executed, it needs to define a new state.
          var state = new State(this.context, stateName, content);
        };
    result.__name__ = stateName;
    result.__context_id__ = this.context.__context_id__;
    return result;
  };

  Module.transfer = function(stateMethod, pred) {
    var name = stateMethod.__name__;
    if (!(new Runtime()).has(name)) {
      // The state is not registered.
      // Register it now.
      stateMethod();
    } else if(stateMethod.__context_id__ !== this.__context_id) {
      // Same state name but update the state
      // because it using new context to define.
      stateMethod();
    } else {
      (new Runtime()).transfer(name, pred);
    }
  };

  return {
    'module': Module,
    'def': Module.def,
    'transfer': Module.transfer
  };
});
