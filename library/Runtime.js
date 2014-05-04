define('NyxishRuntime', ['NyxishState', 'NyxishTransfer', 'NyxishMonitor'],
function(State, Transfer, Monitor) {
  var Runtime = function() {
    if (window.__runtime__) {
      return runtime;
    }
    this.monitors = {};
    this.states = {};
    this.currentState = null;

    window.__runtime__ = this;
    return this;
  };

  Runtime.prototype.has = function(stateName) {
    return !!this.states[stateName];
  };

  Runtime.prototype.transferTo = function(name, pred) {
    (new Transfer(this, this.states[name], pred)).execute();
  };

  Runtime.prototype.transferInterfaces = function() {
    return {
      'defer'
    };
  };

});
