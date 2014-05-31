define('Transfer', [], function() {
  'use strict';
  var Transfer = function(runtime, context, generator, pred) {
    this.runtime = runtime;
    this.generator = generator;
    this.context = context;
    this.pred = pred;
    this.async = 1 === pred.length;
  };

  Transfer.prototype.onPredicationDone = function(predResult) {
    var targetState = null;
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

  Transfer.prototype.execute = function() {
    var predResult = this.pred.call(this.context, this.onPredicationDone);

    // We keep the capability between sync and async versions, which means
    // that the synchronous version is calling the 'done' callback
    // immediately by the transfer itself.
    if (!this.async) {
      this.onPredicationDone(predResult);
    }
  };

  return Transfer;
});
