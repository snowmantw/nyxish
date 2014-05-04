require(['Module', 'NyxishRuntime'], function(Module, Runtime) {
  // Chaining to define states.
  (new Module(this))
    .state__init__()
    .stateFoo()
    .stateBar();

  Runtime.bootstrap();
});
