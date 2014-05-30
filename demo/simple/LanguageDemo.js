define(['Runtime'], function(Runtime) {
  var runtime = new Runtime();
  runtime.infect();

  var Foo = mod({
    'name': 'Foo'
  });

  Foo.__init__ = def(function() {
    var mod = instance();
    this.configs.timeout.transfer = 10 * 1000;

    // So that any transfer timeout would trigger program timeout.
    this.configs.timeout.program = 10 * 1000;

    // So that when program timeout, it would only transfer to
    // the final state forcibly, rather than trigger an error.
    this.configs.error.programTimeout = false;

    transfer(mod.start, function() {
      return true;
    });
  });

  Foo.start = def(function() {
    var mod = instance();
    this.started = true;
    transfer(instance.stop, function() {
      return true;
    });
  });

  Foo.stop = def(function() {
    expect(this.started).to.equal(true);
  });

  runtime.start(Foo);

  expect(Object.keys(runtime.states.module.defining.states).length)
    .to.equal(3);

  runtime.bootstrap();
});
