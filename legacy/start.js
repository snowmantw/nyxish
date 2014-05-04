// built-in keyword: state.
// in the function of state handler, 'this' would become the context.

state('__init__', function() {
  // special case: set the whole program configurations
  // via this way.
  var configs = this.__configs__;
  configs.timeout.perState = 1000;
  configs.timeout.program = 10000;
  configs.max.loopDepth = 10;

  // print states with graphics
  configs.log.graphic = true;
  configs.log.debug = true;
  transfer('start');
});

state('start', function() {
  var {moduleFoo, moduleBar} = require('moduleFoo', 'moduleBar');
  var startTime = moduleFoo.time();
  this.startTime = startTime;

  // transfer would predicate from the context, and the given variables.
  // if no bind, the this still would be the context of the predication.
  transfer('login', moduleFoo.predNeedLogin.bind(this, startTime));

  // any functions bind or no bind this are all OK to become the predication.
  // however it's recommended to modularized these functions if they would be re-used.
  transfer('end', () => {
    return this.startTime > this.timeout;
  });

  transfer(function inline_state() {

    // Uncondtional transferring would be obey immediately,
    // and discard all followed defined transferring.
    transfer('__fin__');
  }, function inline_prediction() {
    return this.startTime > 0;
  });

  // at the end of a state all predictions would be executed and choose one
  // state to trasfer to.
  //
  // debug should print the transferring states
  //
  // developer should guarantee that only one prediction be true with the context.
  // if not, the first queued one (ordering literally) would be picked up.
});

// can put multiple states in one file. 
state('end', function() {
  // unconditional transferring.
  // bottom: no more transferring except the built-in states.
  // test: if some expected transferring not happened before timeout expired (or steps?),
  // test would be failed. this can be done with an addtional arguments of transfer or states,
  // and can be an unique feature of Nyxish.
  // however these settings should be a pre-set runtime config.
  transfer('__fin__');
});

// how to map DOM and other API manipulation into Nyxish.
state('login', function() {
  
  // monitor context change and put it as an arguments of new states.
  // would moniter 'this.responseText'
  // * 'recording': accumlate the changes
  monitor('responseText', {recording: true});

  // Without Promise:
  xhr = new window.XMLHttpRequest();
  xhr.open('get', '/login.html');
  xhr.onload = transfer(this).defer('refresh-login', function prediciton_as_callback(e) {
    // Must call defer with a specific context to avoid it become 'transfer' itself.
    //
    // Must use closure; according to the spec.
    // Another way is `this.xhr = xhr`, then use it inside this prediciton.
    //
    // Since it would not change the context, we need manually append its response.
    this.responseText = xhr.responseText;
    return 200 === xhr.statusText;
  });
  xhr.send();
});

state('refresh-login', function(monitors) {
  // mon: the monitor
  // oldVal: the previous state of this value
  // newVal: the new state of this value
  // changes: accumlated states of this value; array
  // * changes may store lots of old values, so must be turn on with an option
  // * when create the monitor.
  var {mon, oldVal, newVal, changes} = monitors('responseText');


  // No permanent state changing function should be pure functions,
  // not passing and handing by states.

  // clear recorded changes; if any.
  // but the accumlating would continue.
  mon.clear();

  // stop monitoring this context value.
  mon.stop();

  // can monitor a value not yet created.
  monitor('typed', {recording: true});


  // DOM APIs are synchronous, so it's OK to use the ordinary transferring.
  var login = document.getElementById('login-panel');

  // For old 'clear yourself' trick.
  var dt = transfer(this).defer( function check_account(monitors) {

    // Tricks:
    // 1. if...else plus unconditional transferring
    // 2. remove the pre-defined event callback
    // 3. closure to access the login element
    if ('foo' === monitors('keypress').changes.join('')) {
      login.removeEventListener(dt);
      transfer('send-login');
    } else {
      // Transfer to itself: a loop
      // To prevent the event interrupt the stacking transferring,
      // transfer runtime may need to record the interrupt.
      transfer();

      // Or:
      transfer(check_accout); // trick: using function name
    }
  }, (e) => {
    this.typed = e.which;
  } )

  login.appendChild(this.responseText);
  login.querySelector('account')
    .addEventListener('keypress', dt);
});


// About concurrecy and parallel:
// If parallel is for pure computing, we don't need to handle it (compute withing one state, or
// end at the same state.)
// We have asynchronous IO, so concurrency has been handled.
