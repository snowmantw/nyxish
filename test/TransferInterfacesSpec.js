define(['sinon', 'Squire'], function(sinon, Squire) {
  'use struct';
  describe('TransferInterfaces >', function() {
    var injector = new Squire();
    beforeEach(function() {
      var mockTransfer = function() {};
      mockTransfer.prototype.execute = function() {};
      mockTransfer.prototype.execute.bind = function() {
        return sinon.stub();
      };
      injector.mock('Transfer', mockTransfer);
    });

    afterEach(function() {
      injector.clean();
    });

    it('should give a \'Transfer#execute\' after called \'defer\'',
      injector.run(['TransferInterfaces'], function(TransferInterfaces) {
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
          transferInterfaces = new TransferInterfaces(runtime, context),
          method = transferInterfaces.defer();

      method();
      expect(method.called).to.equal(true);
    }));
  });
});
