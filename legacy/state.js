define('NyxishState', [],
function() {
  var State = function(context, name, content) {
    this.context = context;
    this.name = name;
    this.content = content;
    this.monitors = {};
  };

  State.prototype.execute = function() {
    this.content.call(this.context, this.monitors);
  };

  return State;
});
