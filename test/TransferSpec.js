define(['sinon', 'Transfer'], function(sinon, Transfer) {
  'use struct';
  describe('Transfer > ', function() {
    it('should execute the state when we do the transferring', function() {
      var stateExecute = sinon.stub().returns(),
          runtime = {
            'has': sinon.stub().returns(true),
            'state': function() {
              return {
                'execute': stateExecute
              };
            }
          },
          generator = function() {},
          pred = sinon.stub().returns(true),
          transfer = new Transfer(runtime, {},
            generator, pred);

      generator.stateName = 'foo';
      transfer.execute();
      expect(stateExecute.called).to.equal(true);
    });

    it('should call generator when runtime has no such state', function() {
      var stateExecute = sinon.stub().returns(),
          runtime = {
            'has': sinon.stub().returns(false)
          },
          generator = sinon.stub().returns(
            { 'execute': stateExecute }
          ),
          pred = sinon.stub().returns(true),
          transfer = new Transfer(runtime, {},
            generator, pred);

      generator.stateName = 'notfoo';
      transfer.execute();
      expect(generator.called).to.equal(true);
      expect(stateExecute.called).to.equal(true);
    });
  });
});
