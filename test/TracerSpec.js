define(['sinon', 'Squire'], function(sinon, Squire) {
  'use struct';
  describe('Tracer >', function() {
    var injector = new Squire();
    beforeEach(function() {
      var mockStateTracer = function(name, timeout, error) {
            this.configs = { 'name': name };
            this.states = {};
            this.states.timeout = timeout;
            this.states.error = error;
            this.start = function(timestamp) {
              this.states.timestamp = {
                  'start': timestamp,
                  'stop': null
                };
              return this;
            };
            this.stop = function(timestamp) {
              this.states.timestamp.stop = timestamp;
              return this;
            };
            this.clear = sinon.stub();
          },
          mockTransferTracer = function() {},
          mockProgramTracer = function() {};

      injector.mock('StateTracer', mockStateTracer);
      injector.mock('TransferTracer', mockTransferTracer);
      injector.mock('ProgramTracer', mockProgramTracer);
    });
    afterEach(function() {
      injector.clean();
    });

    it('should call tracer start and stop while notifications come',
      injector.run(['Tracer'], function(Tracer) {
        var tracer = new Tracer({
          timeout: {
            state: 0,
            transfer: 0,
            program: 0
          },
          error: {
            stateTimeout: true,
            transferTimeout: true,
            programTimeout: true
          }
        });
        tracer.notify('state', 'define', { 'name': 'foo-state' } );
        tracer.notify('state', 'start', { 'name': 'foo-state' } );
        expect(tracer.stateTracers['foo-state']).to.not.equal(undefined,
          'the tracer contains no corresponding state tracer');
        tracer.notify('state', 'stop', { 'name': 'foo-state' } );
        expect(tracer.stateTracers['foo-state'].states.timestamp.stop)
          .to.not.equal(null,
            'the tracer didn\'t stop the state tracer');
      }));

    it('should clear all tracers in the tracer after we called the shutdown',
      injector.run(['Tracer'], function(Tracer) {
        var tracer = new Tracer({
          timeout: {
            state: 0,
            transfer: 0,
            program: 0
          },
          error: {
            stateTimeout: true,
            transferTimeout: true,
            programTimeout: true
          }
        });
        tracer.notify('state', 'define', { 'name': 'foo-state' } );
        tracer.notify('state', 'define', { 'name': 'bar-state' } );
        tracer.notify('state', 'start', { 'name': 'foo-state' } );
        tracer.notify('state', 'start', { 'name': 'bar-state' } );
        tracer.shutdown();
        expect(tracer.stateTracers['foo-state'].clear.called).to.equal(true,
          'the method didn\'t invoke the clear method of the state tracer');
      }));
  });
});
