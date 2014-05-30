define('modules/DefaultStates', ['Runtime'],
function(Runtime) {
  var runtime = new Runtime();
  runtime.infect();

  DefaultStates = mod({});
  DefaultStates.__init__ = def(function() {
    var mod = instance();
    transfer(mod.__fin__, function() {
      return true;
    });
  });

  DefaultStates.__fin__ = def(function() {
    runtime.shutdown(this);
  });

  return DefaultStates;
});
