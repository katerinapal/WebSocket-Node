"use strict";

var _tape = require("tape");

var _tape2 = _interopRequireDefault(_tape);

var _WebSocketClient = require("../../lib/WebSocketClient");

var _testServer = require("../shared/test-server");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var stopServer = _testServer.testserverjs.stopServer;

(0, _tape2.default)('Request can only be rejected or accepted once.', function (t) {
  t.plan(6);

  t.on('end', function () {
    stopServer();
  });

  _testServer.testserverjs.prepare(function (err, wsServer) {
    if (err) {
      t.fail('Unable to start test server');
      return t.end();
    }

    wsServer.once('request', firstReq);
    connect(2);

    function firstReq(request) {
      var accept = request.accept.bind(request, request.requestedProtocols[0], request.origin);
      var reject = request.reject.bind(request);

      t.doesNotThrow(accept, 'First call to accept() should succeed.');
      t.throws(accept, 'Second call to accept() should throw.');
      t.throws(reject, 'Call to reject() after accept() should throw.');

      wsServer.once('request', secondReq);
    }

    function secondReq(request) {
      var accept = request.accept.bind(request, request.requestedProtocols[0], request.origin);
      var reject = request.reject.bind(request);

      t.doesNotThrow(reject, 'First call to reject() should succeed.');
      t.throws(reject, 'Second call to reject() should throw.');
      t.throws(accept, 'Call to accept() after reject() should throw.');

      t.end();
    }

    function connect(numTimes) {
      var client;
      for (var i = 0; i < numTimes; i++) {
        client = new _WebSocketClient.WebSocketClient();
        client.connect('ws://localhost:64321/', 'foo');
        client.on('connect', function (connection) {
          connection.close();
        });
      }
    }
  });
});

(0, _tape2.default)('Protocol mismatch should be handled gracefully', function (t) {
  var wsServer;

  t.test('setup', function (t) {
    _testServer.testserverjs.prepare(function (err, result) {
      if (err) {
        t.fail('Unable to start test server');
        return t.end();
      }

      wsServer = result;
      t.end();
    });
  });

  t.test('mismatched protocol connection', function (t) {
    t.plan(2);
    wsServer.on('request', handleRequest);

    var client = new _WebSocketClient.WebSocketClient();

    var timer = setTimeout(function () {
      t.fail('Timeout waiting for client event');
    }, 2000);

    client.connect('ws://localhost:64321/', 'some_protocol_here');
    client.on('connect', function (connection) {
      clearTimeout(timer);
      connection.close();
      t.fail('connect event should not be emitted on client');
    });
    client.on('connectFailed', function () {
      clearTimeout(timer);
      t.pass('connectFailed event should be emitted on client');
    });

    function handleRequest(request) {
      var accept = request.accept.bind(request, 'this_is_the_wrong_protocol', request.origin);
      t.throws(accept, 'request.accept() should throw');
    }
  });

  t.test('teardown', function (t) {
    stopServer();
    t.end();
  });
});