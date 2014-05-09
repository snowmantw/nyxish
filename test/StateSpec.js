define(['sinon', 'State'], function(sinon, State) {
  'use strict';
  describe('State > ', function() {
    it('should register itself via the runtime\'s method', function() {
      var runtime = {
        'request': function(category, method, detail) {
          expect(category).to.equal('state');
          expect(method).to.equal('register');
          expect(detail.name).to.equal('foo');
        }
      },
      content = sinon.stub(),
      subject = new State(runtime, {}, 'foo', content);
    });

    it('should execute with the given context', function() {
      var runtime = {
        'request': sinon.stub(),
        'notify': function(category, method, detail) {
          expect(category).to.equal('state');
          expect(method).to.equal('done');
          expect(detail.name).to.equal('foo');
        }
      },
      content = function() {
        expect(this.foo).to.equal(2);
      },
      context = {
        'foo': 2
      },
      subject = new State(runtime, context, 'foo', content);
      subject.execute();
    });
  });
});
