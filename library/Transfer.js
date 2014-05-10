define('Transfer', [], function() {
  'use strict';
  var Transfer = function(runtime, context, generator, pred) {
    this.runtime = runtime;
    this.generator = generator;
    this.context = context;
    this.pred = pred;
  };

  Transfer.prototype.execute = function() {
    var targetState = null,
        predResult = this.pred.call(this.context);

    if (!predResult) {
      return false;
    }

    if (!this.runtime.has(this.generator.stateName)) {
      targetState = this.generator();
    } else {
      targetState = this.runtime.state(this.generator.stateName);
    }
    targetState.execute();
    return true;
  };

  return Transfer;
});
