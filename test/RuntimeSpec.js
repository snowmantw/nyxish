define(['sinon', 'Squire'], function(sinon, Squire) {
  'use struct';
  describe('Runtime >', function() {
    var injector = new Squire();
    beforeEach(function() {
      var mockModule = function() {};
      injector.mock('Module', mockModule);

      var mockDefaultStates = function() {};
      injector.mock('modules/DefaultStates', mockDefaultStates);
    });

    afterEach(function() {
      injector.clean();
    });

    it('should call Module#transfer when we invoke the transfer function',
      injector.run(['Runtime'], function(Runtime) {
        var stubGenerator = sinon.stub(),
            pred = sinon.stub().returns(true),
            runtime = new Runtime();

        runtime.states.module.active = {
          transfer: sinon.stub()
        };
        runtime.start();
        runtime.transfer(stubGenerator);
        expect(runtime.states.module.active.transfer.called).to.equal(true);
        delete window.__runtime__;
      }));
  });
});
