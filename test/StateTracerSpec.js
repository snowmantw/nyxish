define(['sinon', 'StateTracer'], function(sinon, StateTracer) {
  'use struct';
  describe('StateTracer >', function() {
    beforeEach(function() {});
    afterEach(function() {});
    it('should set timeout when the configs set', function(done) {
      var tracer = new StateTracer('foo'),
          stubWarning = sinon.stub(tracer, 'timeoutWarning', function() {
            stubWarning.restore();
            done();
          });
      tracer.start(Date.now(), 500, false);
    });

    it('should throw error when the configs set', function(done) {
      var tracer = new StateTracer('foo'),
          stubError = sinon.stub(tracer, 'timeoutError', function() {
            stubError.restore();
            done();
          });
      tracer.start(Date.now(), 500, true);
    });

    it('should NOT throw error when timeout not happened', function(done) {
      var tracer = new StateTracer('foo'),
          stubError = sinon.stub(tracer, 'timeoutError');
      tracer.start(Date.now(), 500, true);
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
