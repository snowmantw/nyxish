define('NyxishRuntime', ['NyxishState', 'NyxishTransfer'],
function(State, Transfer) {
  var Runtime = function() {};
  Runtime.generateStateName = function() {
    return Date.now();
  };

  Runtime.state = function(nameOrContent, content) {
    var name = nameOrContent,
        state;
    if ('function' === nameOrContent) {
      content = nameOrContent;
      name = Runtime.generateStateName();
    }
    state = new State(name, content);
    // TODO: get the state registered and ready.
    return state;
  };

  Runtime.transfer = function(targetOrContentOrContext, pred) {
    var target = content = context = nameOrContentOrContext;
    switch(typeof targetOrContentOrContext) {
      case 'string':    // ordinary state
        content = context = null;
        break;
      case 'function':  // anonymous state
        context = null;
        // Create the anonymous state.
        target = Runtime.state(content).name;
        break;
      case 'object':    // deferred transferring or something else
      /* falls through */
      default:
        target = content = null;
        return Runtime.transferInterfaces(context);
    }
    if (null !== target) {
      var predResult = pred();
      if (predResult) {
        Runtime.doTransfer(this, target);
        // TODO: implement doTransfer
      }
    } else {
      // TODO: if pred is false, log it
    }
  };

  return Runtime;
});
