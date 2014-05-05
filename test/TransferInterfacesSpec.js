define(['sinon', 'TransferInterfaces'], function(sinon, TransferInterfaces) {
  'use struct';
  describe('TransferInterfaces >', function() {
    it('should give a \'Transfer#execute\' after called \'defer\'', function() {
      var runtime = {
            'has': sinon.stub().returns(true),
            'state': function() {
              return {
                '__context_id__': 'bar',
                'execute': stateExecute
              };
            }
          },
          context = {'__context_id__': 'bar'},
          transferInterfaces = new TransferInterfaces(runtime, context);
      
    });
  });
});
