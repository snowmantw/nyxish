define('TransferTracer', ['BasicTracer'],
function(BasicTracer) {
  'use strict';
  /**
   * Inhert the BasicTracer.
   */
  var TransferTracer = function(name, timeout, error) {
    BasicTracer.prototype.setup.call(this);
    this.define(name, timeout, error);
    this.configs.type = 'transfer';
  };

  TransferTracer.prototype = Object.create(BasicTracer.prototype);

  return TransferTracer;
});
