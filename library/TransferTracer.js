define('TransferTracer', ['BasicTracer'],
function(BasicTracer) {
  'use strict';
  /**
   * Inhert the BasicTracer.
   */
  var TransferTracer = function(name) {
    BasicTracer.prototype.setup.call(this);
    this.setup();
  };

  TransferTracer.prototype = Object.create(BasicTracer.prototype);

  TransferTracer.prototype.setup = function(name) {
    this.configs.type = 'transfer';
    this.configs.name = name;
  };

  return TransferTracer;
});
