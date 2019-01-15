var http = require('http');
var colors = require('colors/safe');
var request = require('request');

var pig = {
  targets: {},
  counter: 0,
  init: function() {
    console.log('the pig is truffling!');
    // get our server source list to know what to test
    targets = this.setServerList();
    console.log('truffling ' + targets.length + ' sources');
    console.log('* * *');
    // send a request for each entry in the server source list
    for (var i = 0; i < targets.length; i++) {
      // @TODO implement promises so that we know when requests are finished
      this.sendRequest(targets[i]);
    }
  },
  
  sendRequest: function(o) {
    var that = this;

    // example of all options configurable via list.json
    //   {
    //       "host":"www.google.com",
    //       "protocol":"http",
    //       "path":"/",
    //       "method":"GET"
    //   }

    var options = {
      host: o.host, // no default applicable, since we haven't yet implemented a mind reading plugin
      port: o.port || 80, // port is not implemented yet
      method: o.method || 'GET',
      path: o.path || '/',
      protocol: o.protocol || "http"
    };

    options.uri = options.protocol + "://" + options.host;
    // handle custom ports if we have them
    if (options.port !== 80) {
      options.uri = options.uri + ":" + options.port;
    }

    options.uri = options.uri + options.path;

    request(options.uri, function (error, response, body) {
      console.log(colors.yellow('uri:' + options.uri));
      if (error !== null) {
        that.logError(error)
      } else {
        that.logResponse(response) // Print the response status code if a response was received
      }
    });

  },

  logResponse: function(response) {
      // console.log('statusCode:', response && response.statusCode);
      console.log(colors.green('status code: ' + response.statusCode));
      this.afterRequest();
  },

  logError: function(error) {
      console.log(colors.red('error: ' + error));
      this.afterRequest()
  },

  afterRequest: function() {
    this.anotherTruffle();
    console.log('-----');
  },

  // refactor, refactor, refactor 
  anotherTruffle: function() {
    this.counter += 1;
    if (this.counter === targets.length) {
      console.log('* * *');
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
