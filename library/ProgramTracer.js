define('ProgramTracer', ['BasicTracer'],
function(BasicTracer) {
  'use strict';
  /**
   * Inhert the BasicTracer.
   */
  var ProgramTracer = function(name) {
    BasicTracer.prototype.setup.call(this);
    this.setup();
  };

  ProgramTracer.prototype = Object.create(BasicTracer.prototype);

  ProgramTracer.prototype.setup = function(name) {
    this.configs.type = 'program';
    this.configs.name = name;
  };

  return ProgramTracer;
});
