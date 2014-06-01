define('StateTracer', ['BasicTracer'],
function(BasicTracer) {
  'use strict';

  /**
   * Inherit the BasicTracer.
   */
  var StateTracer = function(name) {
    BasicTracer.prototype.setup.call(this);
    this.setup(name);
  };

  StateTracer.prototype = Object.create(BasicTracer.prototype);

  StateTracer.prototype.setup = function(name) {
    this.configs.name = name;
    this.configs.type = 'state';
  };

  return StateTracer;
});
