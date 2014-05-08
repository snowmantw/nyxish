define(['sinon', 'Monitor'], function(sinon, Monitor) {
  'use strict';
  describe('Monitor > ', function() {
    it('should change the monitoring value when transferring', function() {
      var runtime = {},
          context = {'foo': 2},
          entry = 'foo',
          configs = {},
          monitor = new Monitor(runtime, context, entry, configs);
      monitor.transfer(context);
      // Assume we're in the new state now.
      context.foo = 3;
      var {past, current, changes} = monitor.execute(context);
      expect(past).toBe(2);
      expect(current).toBe(3);
      expect(changes.length).toBe(0);
    });

    it('should serialized when the config flag is set', function() {
      var runtime = {},
          context = {'foo': {'bar': 99}},
          entry = 'foo',
          configs = {'serialized': true},
          comparingTarget = JSON.stringify({'serialized': context.foo}),
          monitor = new Monitor(runtime, context, entry, configs);
      monitor.transfer(context);
      // Assume we're in the new state now.
      context.foo = 3;
      var {past, current, changes} = monitor.execute(context);
      expect(past).toBe(comparingTarget);
    });
  });
});
