define(['sinon', 'State'], function(sinon, State) {
  describe('State > ', function() {
    'use strict';
    it('should register itself via the runtime\'s method', function() {
      var runtime = {
        'request': function(category, method, detail) {
          expect(category).toBe('state');
          expect(method).toBe('register');
          expect(detail.name).toBe('foo');
        }
      },
      content = sinon.stub(),
      subject = new State(runtime, {}, 'foo', content);
    });

    it('should execute with the given context', function() {
      var runtime = {
        'request': sinon.stub(),
        'notify': function(category, method, detail) {
          expect(category).toBe('state');
          expect(method).toBe('done');
          expect(detail.name).toBe('foo');
        }
      },
      content = function() {
        expect(this.foo).toBe(2);
      },
      context = {
        'foo': 2
      },
      subject = new State(runtime, context, 'foo', content);
      subject.execute();
    });
  });
});
