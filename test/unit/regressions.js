"use strict";

var _startEchoServer = require("../shared/start-echo-server");

var _startEchoServer2 = _interopRequireDefault(_startEchoServer);

var _WebSocketClient = require("../../lib/WebSocketClient");

var _WebSocketClient2 = _interopRequireDefault(_WebSocketClient);

var _tape = require("tape");

var _tape2 = _interopRequireDefault(_tape);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var test = _tape2.default;

var WebSocketClient = _WebSocketClient2.default;
var startEchoServer = _startEchoServer2.default;

test('Issue 195 - passing number to connection.send() shouldn\'t throw', function (t) {
  startEchoServer(function (err, echoServer) {
    if (err) {
      return t.fail('Unable to start echo server: ' + err);
    }

    var client = new WebSocketClient();
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