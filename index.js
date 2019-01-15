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

    var options = {
      host: o.host, // no default applicable, since we haven't yet implemented a mind reading plugin
      port: o.port || 80, // port is not implemented yet
      method: o.method || 'GET',
      path: o.path || '/',
      // protocol: o.protocol || "http", [do not add protocol to options object that goes to request because it will break]
      body: o.body || undefined
    };

    // construct the uri, a required property for the options object sent to request()
    options.uri = o.protocol + "://" + options.host;
    // handle custom ports if we have them
    if (options.port !== 80) {
      options.uri = options.uri + ":" + options.port;
    }

    // check if we're sending json as a payload
    // and be double sure because typeof(null) returns "object"
    if (typeof(options.body) === "object" && options.body !== null) {
      options.json = true;
    }

    options.uri = options.uri + options.path;

    request(options, function (error, response, body) {
      console.log(colors.yellow('uri:' + options.uri));
      console.log(colors.yellow('method:' + options.method));
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

      // only log json so we don't get blocks of html
      // some providers return "charset=utf-8" within the content-type string
      // so set this as a string detection
      if (response.headers['content-type'].indexOf('application/json') > -1) {
        console.log(colors.green('response body on next line:'));
        console.log(colors.green(JSON.stringify(response.body)));
      }

      // console.log(colors.green('response body: ' + response.body));
      this.afterRequest();
  },

  logError: function(error) {
      console.log(colors.red('raw error output below this line'));
      console.log(colors.red(error));
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
