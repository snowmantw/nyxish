define(['sinon', 'Squire'], function(sinon, Squire) {
  'use struct';
  describe('Configs >', function() {
    var injector = new Squire();
    beforeEach(function() {});
    afterEach(function() {
      injector.clean();
    });
    it('should define all categories with default values: timeout',
      injector.run(['Configs'], function(Configs) {
        var configs = new Configs();
        expect(configs.timeout.transfer).to.equal(0);
        expect(configs.timeout.program).to.equal(0);
      }));


    it('should define all categories with default values: error',
      injector.run(['Configs'], function(Configs) {
        var configs = new Configs();
        expect(configs.error.programTimeout).to.equal(true);
      }));

    it('should contain all properties as write-once only',
      injector.run(['Configs'], function(Configs) {
        var configs = new Configs();
        configs.timeout.transfer = 10 * 1000;
        expect(configs.timeout.transfer).to.equal(10 * 1000);
        configs.timeout.transfer = 0;
        expect(configs.timeout.transfer).to.equal(10 * 1000);
      }));
  });
});
