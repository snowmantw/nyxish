define('NyxishTransfer', [],
function() {
  var Transfer = function(runtime, toState, pred) {
    this.runtime = runtime;
    this.context = context;
    this.pred = pred;
    this.toState = toState;
  };

  Transfer.prototype.execute = function(fromState) {
    var result = this.pred(),
        monitors = fromState.monitors;

    // When we execute transferring, it means we can finally record
    // changes in the current state as 'new' changes of the monitor.
    monitors.forEach((mon) => {
      mon.change(mon.fromState.context[mon.targetName]);
    });
    if (result) {
      this.toState.execute();
    } else {
      // TODO: error handling.
    }
  };

  return Transfer;
});
