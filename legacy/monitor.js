define('NyxishMonitor', [],
function() {
  var Monitor = function(targetName, options, value) {
    this.targetName = targetName;
    this.options = options;
    this.value = value;
    this.states = {
      newVal: value,
      oldVal: undefined,
      changes: []
    };

    if (this.options.recording) {
      // Initialize with the value.
      this.states.changes = [value];
    }
  };

  Monitor.prototype.clear = function() {
    this.changes.length = 0;
  };

  Monitor.prototype.stop = function() {
    this.stoped = true;
  };

  Monitor.change = function(newVal) {
    this.states.oldVal = this.value;
    this.states.newVal = newVal;
    this.states.value = newVal;

    if (this.options.recording) {
      // Initialize with the value.
      this.changes.push(value);
    }
  };

  return Monitor;
});
