define('Runtime', ['State', 'Transfer', 'TransferInterfaces'],
function(State, Transfer, Monitor) {
  var Runtime = function() {
    if (window.__runtime__) {
      return window.__runtime__;
    }

    window.__runtime__ = this;
    return this;
  };

  return Runtime;
});
