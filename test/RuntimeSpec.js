define(['sinon', 'Squire'], function(sinon, Squire) {
  'use struct';
  describe('Runtime >', function() {
    var injector = new Squire();
    beforeEach(function() {
      var mockModule = function(runtime, context, name) {
        this.runtime = runtime;
        this.context = context;
        this.configs = { 'name': name };
        this.monitors = {};
        this.transfer = function() {};
      };
      injector.mock('Module', mockModule);

      var mockDefaultStates = function() {};
      injector.mock('modules/DefaultStates', mockDefaultStates);
    });

    afterEach(function() {
      injector.clean();
    });

    it('should call Module#transfer when we invoke the transfer function',
      injector.run(['Runtime', 'Module'],
      function(Runtime, Module) {
        var module = new Module(),
            stubGenerator = sinon.stub(),
            stubTransfer = sinon.stub(module, 'transfer'),
            pred = sinon.stub().returns(true),
            runtime = new Runtime();

        runtime.start(module);
        runtime.transfer(stubGenerator);
        expect(runtime.states.module.active.transfer.called).to.equal(true);
        delete window.__runtime__;
      }));

    it('should do monitor transferring while response to module transferring',
      injector.run(['Runtime'], function(Runtime) {
        var runtime = new Runtime();
        runtime.states.module.modules.foo = {
          monitors: []
        };
        runtime.states.module.active = {
          monitors: [1,2,3] // We only need to test the re-assignation.
        };
        runtime.responseModuleTransfer('foo');
        expect(runtime.states.module.modules.foo.monitors)
          .to.have.members([1,2,3]);
      }));

    it('should define a module while the function got called',
      injector.run(['Runtime'], function(Runtime) {
        var runtime = new Runtime();
        runtime.module({'foo': 1});
        expect(runtime.states.module.defining.context.foo).to.equal(1);
      }));
  });
});
