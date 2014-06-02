define('StateTracer', ['BasicTracer'],
function(BasicTracer) {
  'use strict';

  /**
   * Inherit the BasicTracer.
   */
  var StateTracer = function(name, timeout, error) {
    BasicTracer.prototype.setup.call(this);
    this.define(name, timeout, error);
    this.configs.type = 'state';
  };

  StateTracer.prototype = Object.create(BasicTracer.prototype);

  return StateTracer;
});
