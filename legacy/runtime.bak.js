define('NyxishRuntime', ['NyxishState', 'NyxishTransfer', 'NyxishMonitor'],
function(State, Transfer, Monitor) {
  var Runtime = function() {
    this.monitors = {};
    this.states = {};
    this.currentState = null;
  };

  Runtime.prototype.generateStateName = function() {
    return Date.now();
  };

  Runtime.prototype.queueState = function(state) {
    this.states[state.name] = state;
  };

  Runtime.prototype.queueMonitor = function(monitor) {
    this.monitors[monitor.targetName] = monitor;
  };

  Runtime.prototype.transferInterfaces = function(context) {
    return {
      'defer': this.transferDefer.bind(this, context)
    };
  };

  Runtime.prototype.transferDefer = function(context, target, pred) {
    var transfer = new Transfer(context, pred, this.states[target]);
    return transfer;
  };

  Runtime.prototype.state = function(nameOrContent, content) {
    var name = nameOrContent,
        state;
    if ('function' === nameOrContent) {
      content = nameOrContent;
      name = this.generateStateName();
    }
    state = new State(context, name, content);
    this.queueState(state);
    return state;
  };

  Runtime.prototype.transfer = function(targetOrContentOrContext, pred) {
    var target = content = context = nameOrContentOrContext,
        transfer;
    switch(typeof targetOrContentOrContext) {
      case 'string':    // ordinary state
        content = context = null;
        break;
      case 'function':  // anonymous state
        context = null;
        // Create the anonymous state.
        target = this.state(content).name;
        break;
      case 'object':    // deferred transferring or something else
      /* falls through */
      default:
        target = content = null;
        return this.transferInterfaces(context);
    }
    if (null !== target) {
      transfer = new Transfer(context, pred, this.states[target]);
      // Immediately execute the predication and transferring.
      var newState = transfer.execute(this.currentState);
      this.currentState = null === newState ? this.currentState : newState;
    }
  };

  Runtime.prototype.monitor = function(name, options) {
    var monitor = new Monitor(name, options, this.currentState.context[name]);
    this.queueMonitor(monitor);
  };

  return Runtime;
});
