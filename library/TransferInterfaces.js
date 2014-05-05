(define('TransferInterfaces', ['Transfer'], function(Transfer) {
  'use strict';
  var TransferInterfaces = function(runtime, context) {
    this.runtime = runtime;
    this.context = context;
  };

  TransferInterfaces.prototype.defer = function(generator, pred) {
    var transfer = new Transfer(this.runtime, this.context,
      generator, pred);

    return transfer.execute.bind(transfer);
  };

  return TransferInterfaces;
}));
