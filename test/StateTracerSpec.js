define(['sinon', 'StateTracer'], function(sinon, StateTracer) {
  'use struct';
  describe('StateTracer >', function() {
    beforeEach(function() {});
    afterEach(function() {});
    it('should set timeout when the configs set', function(done) {
      var tracer = new StateTracer('foo', 500, false),
          stubWarning = sinon.stub(tracer, 'timeoutWarning', function() {
            stubWarning.restore();
            done();
          });
      tracer.start(Date.now());
    });

    it('should throw error when the configs set', function(done) {
      var tracer = new StateTracer('foo', 500, true),
          stubError = sinon.stub(tracer, 'timeoutError', function() {
            stubError.restore();
            done();
          });
      tracer.start(Date.now());
    });

    it('should NOT throw error when timeout not happened', function(done) {
      var tracer = new StateTracer('foo', 500, true),
          stubError = sinon.stub(tracer, 'timeoutError');
      tracer.start(Date.now());
      setTimeout(function() {
        tracer.stop();
      }, 300);
      setTimeout(function() {
        expect(stubError.called).to.not.equal(true);
        done();
      }, 800);
    });
  });
});
