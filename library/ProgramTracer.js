define('ProgramTracer', ['BasicTracer'],
function(BasicTracer) {
  'use strict';
  /**
   * Inhert the BasicTracer.
   */
  var ProgramTracer = function(name, timeout, error) {
    BasicTracer.prototype.setup.call(this);
    this.define(name, timeout, error);
    this.configs.type = 'program';
  };

  ProgramTracer.prototype = Object.create(BasicTracer.prototype);

  return ProgramTracer;
});
