#!/usr/bin/env node
"use strict";

var _tape = require("tape");

var _tape2 = _interopRequireDefault(_tape);

var _WebSocketClient = require("../../lib/WebSocketClient");

var _testServer = require("../shared/test-server");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var stopServer = _testServer.testserverjs.stopServer;

(0, _tape2.default)('Drop TCP Connection Before server accepts the request', function (t) {
  t.plan(5);

  _testServer.testserverjs.prepare(function (err, wsServer) {
    if (err) {
      t.fail('Unable to start test server');
      return t.end();
    }

    wsServer.on('connect', function (connection) {
      t.pass('Server should emit connect event');
    });

    wsServer.on('request', function (request) {
      t.pass('Request received');

      // Wait 500 ms before accepting connection
      setTimeout(function () {
        var connection = request.accept(request.requestedProtocols[0], request.origin);

        connection.on('close', function (reasonCode, description) {
          t.pass('Connection should emit close event');
          t.equal(reasonCode, 1006, 'Close reason code should be 1006');
          t.equal(description, 'TCP connection lost before handshake completed.', 'Description should be correct');
          t.end();
          stopServer();
        });

        connection.on('error', function (error) {
          t.fail('No error events should be received on the connection');
          stopServer();
        });
      }, 500);
    });

    var client = new _WebSocketClient.WebSocketClient();
    client.on('connect', function (connection) {
      t.fail('Client should never connect.');
      connection.drop();
      stopServer();
      t.end();
    });

    client.connect('ws://localhost:64321/', ['test']);

    setTimeout(function () {
      // Bail on the connection before we hear back from the server.
      client.abort();
    }, 250);
  });
});