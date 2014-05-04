define(['sinon', 'Transfer'], function(sinon, Transfer) {
  'use struct';
  describe('Transfer > ', function() {
    it('should execute the state when we do the transferring', function() {
      var stateExecute = sinon.stub().returns(),
          runtime = {
            'has': sinon.stub().returns(true),
            'state': function() {
              return {
                '__context_id__': 'bar',
                'execute': stateExecute
              };
            }
          },
          generator = function() {},
          pred = sinon.stub().returns(true),
          transfer = new Transfer(runtime, {'__context_id__': 'bar'},
            generator, pred);

      generator.__state_name__ = 'foo';
      transfer.execute();
      expect(stateExecute.called).toBe(true);
    });

    it('should call generator when runtime has no such state', function() {
      
    });
  });
});
