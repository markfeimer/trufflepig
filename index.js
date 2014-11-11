var http = require('http');
var colors = require('colors/safe');

var pig = {
  targets: {},
  counter: 0,
  init: function() {
    console.log('the pig is truffling!');
    // get our server source list to know what to test
    targets = this.setServerList();
    console.log('truffling ' + targets.length + ' sources');
    // send a request for each entry in the server source list
    for (var i = 0; i < targets.length; i++) {
      // @TODO implement promises so that we know when requests are finished
      this.sendRequest(targets[i]);
    }
  },
  
  sendRequest: function(o) {
    var that = this;

    // @TODO add protocol field support to switch http/s
    var options = {
      hostname: o.hostname,
      port: o.port || 80,
      method: o.method || 'GET',
      path: o.path || '/'
    };
    var newreq = http.request(options, function(lres) {
      console.log(colors.green('host: ' + options.hostname));
      console.log(colors.green('status: ' + lres.statusCode));
      that.afterRequest();
      return lres.statusCode;
    })
    newreq.on('error', function(e) {
      console.log(colors.red('call to ' + options.hostname + ' failed'));
      console.log(colors.red('error: ' + e.message));
      that.afterRequest();
    });
    newreq.end();
  },

  afterRequest: function() {
    this.anotherTruffle();
    console.log('-----');
  },

  // refactor, refactor, refactor 
  anotherTruffle: function() {
    this.counter += 1;
    if (this.counter === targets.length) {
      console.log('exiting...');
      process.exit(0);
    } else {
      console.log('onto the next one!');
    }
  },
  setServerList: function() {
    return require('./list.json');
  }
};

pig.init();
