define('modules/DefaultStates', ['Runtime'],
function(Runtime) {
  var runtime = new Runtime();
  runtime.infect();

  DefaultStates = mod({});
  DefaultStates.__init__ = def(function() {
    var instance = instance();
    transfer(instance.__fin__, function() {
      return true;
    });
  });

  DefaultStates.__fin__ = def(function() {
    runtime.shutdown(this);
  });

  return DefaultStates;
});
