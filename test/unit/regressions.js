"use strict";

var _tape = require("tape");

var _tape2 = _interopRequireDefault(_tape);

var _WebSocketClient = require("../../lib/WebSocketClient");

var _startEchoServer = require("../shared/start-echo-server");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _tape2.default)('Issue 195 - passing number to connection.send() shouldn\'t throw', function (t) {
  (0, _startEchoServer.startEchoServer)(function (err, echoServer) {
    if (err) {
      return t.fail('Unable to start echo server: ' + err);
    }

    var client = new _WebSocketClient.WebSocketClient();
    client.on('connect', function (connection) {
      t.pass('connected');

      t.doesNotThrow(function () {
        connection.send(12345);
      });

      connection.close();
      echoServer.kill();
      t.end();
    });

    client.on('connectFailed', function (errorDescription) {
      echoServer.kill();
      t.fail(errorDescription);
      t.end();
    });

    client.connect('ws://localhost:8080', null);
  });
});