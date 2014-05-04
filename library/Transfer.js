define('Transfer', [], function() {
  'use strict';
  var Transfer = function(runtime, context, generator, pred) {
    this.runtime = runtime;
    this.generator = generator;
    this.context = context;
    this.pred = pred;
  };

  Transfer.prototype.execute = function() {
    var target = null,
        predResult = this.pred.call(this.context);

    if (!predResult) {
      return false;
    }

    // 1. No such state
    // 2. Has the state but with different context
    // 3. Has the correct state
    if (!this.runtime.has(this.generator.__state_name__) ||
        (this.runtime.state(this.generator.__state_name__).__context_id__ !==
         this.context.__context_id__)
        ) {
      target = this.generator();
    } else {
      target = this.runtime.state(this.generator.__state_name__);
    }
    target.execute();
    return true;
  };

  return Transfer;
});
