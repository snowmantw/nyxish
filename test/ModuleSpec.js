define(['sinon', 'Squire'], function(sinon, Squire) {
  'use struct';
  describe('Module >', function() {
    var injector = new Squire(),
        mockState = null,
        mockTransfer = null,
        stubCalled = {};

    beforeEach(function() {
      mockState = function(runtime, context, name, content) {
        this.runtime = runtime;
        this.context = context;
        this.content = content;
        this.configs = {};
        this.configs.name = name;
      };
      injector.mock('State', mockState);

      // XXX: Because methods of the mock module in another file can't
      // be stubbed here, and can't be queried if it's called.
      mockTransfer = function() {
        stubCalled.Transfer = { 'execute': {} };
      };
      mockTransfer.prototype.execute = function() {
        stubCalled.Transfer.execute.called = true;
      };
      injector.mock('Transfer', mockTransfer);
    });

    afterEach(function() {
      injector.clean();
    });

    it('should return a specific generator while we call the define method',
      injector.run(['Module'], function(Module) {
        var runtime = {},
            context = {},
            content = function() {},
            generator = null,
            stubStateName = sinon.stub(Module.prototype, 'stateName')
                            .returns('state-foo'),
            stubGeneratorName = sinon.stub(Module.prototype, 'generatorName')
                            .returns('generator-foo'),
            module = new Module(runtime, context, 'module-foo');

        generator = module.define(content);
        expect(generator.methodName).to.equal('generator-foo');
        expect(generator.stateName).to.equal('state-foo');
        expect(generator.moduleName).to.equal('module-foo');

        stubStateName.restore();
        stubGeneratorName.restore();
    }));

    it('should generate and register a state when we call the generator',
      injector.run(['Module'], function(Module) {
        var runtime = {},
            context = {},
            content = function() {},
            generator = null,
            stubRequestRegisterState = sinon.stub(Module.prototype,
              'requestRegisterState',
              function(state) {
                expect(state.configs.name).to.equal('state-foo');
              }),
            stubStateName = sinon.stub(Module.prototype, 'stateName')
                            .returns('state-foo'),
            stubGeneratorName = sinon.stub(Module.prototype, 'generatorName')
                            .returns('generator-foo'),
            module = new Module(runtime, context, 'module-foo');

        generator = module.define(content);
        generator();

        expect(module.states['state-foo']).not.equal(undefined);

        stubRequestRegisterState.restore();
        stubStateName.restore();
        stubGeneratorName.restore();
    }));

    it('should do inner module transferring',
      injector.run(['Module', 'Transfer'], function(Module, Transfer) {
        var runtime = {},
            context = {},
            generator = function() {},
            module = new Module(runtime, context, 'module-foo');

        generator.moduleName = 'module-foo';
        module.transfer(generator, function() {});

        expect(stubCalled.Transfer.execute.called).to.equal(true);
        stubCalled.Transfer.execute.called = false;
    }));

    it('should do intra module transferring when it\'s necessary',
      injector.run(['Module'], function(Module) {
        var runtime = {},
            context = {},
            generator = function() {},
            module = new Module(runtime, context, 'module-foo'),
            stubTargetModule = {
              transfer: function(gen, pred) {
                expect(gen.generatorName).to.equal('generator-foo');
              }
            },
            stubRequestModuletransfer =
            sinon.stub(Module.prototype, 'requestModuleTransfer',
            function(targetName, cb) {
              cb(stubTargetModule);
            });

          generator.generatorName = 'generator-foo';
          generator.moduleName = 'module-not-foo';
          module.transfer(generator, function() {});

          stubRequestModuletransfer.restore();
      }));
  });
});
