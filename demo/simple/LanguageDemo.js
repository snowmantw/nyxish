define(['Runtime'], function(Runtime) {
  var runtime = new Runtime();
  runtime.infect();

  /**
   * Two types of modules: one is library-orient module, which provide
   * only common functions can be called, no matter whether they're
   * stateless or stateful. The other one is for main program, which
   * contains only states and trasferrings, which should never been
   * invoked as re-usable components.
   *
   * Maybe some module can mix these two kinds of modules, but I don't
   * think it's a good idea.
   */
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
