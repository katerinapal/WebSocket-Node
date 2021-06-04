"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.testserverjs = undefined;

var _http = require("http");

var _http2 = _interopRequireDefault(_http);

var _WebSocketServer = require("../../lib/WebSocketServer");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var server;
var wsServer;

function prepare(callback) {
  if (typeof callback !== 'function') {
    callback = function callback() {};
  }
  server = _http2.default.createServer(function (request, response) {
    response.writeHead(404);
    response.end();
  });

  wsServer = new _WebSocketServer.WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false,
    maxReceivedFrameSize: 64 * 1024 * 1024, // 64MiB
    maxReceivedMessageSize: 64 * 1024 * 1024, // 64MiB
    fragmentOutgoingMessages: false,
    keepalive: false,
    disableNagleAlgorithm: false
  });

  server.listen(64321, function (err) {
    if (err) {
      return callback(err);
    }
    callback(null, wsServer);
  });
}

function stopServer() {
  try {
    wsServer.shutDown();
    server.close();
  } catch (e) {
    console.warn('stopServer threw', e);
  }
}

exports.testserverjs = mod_testserverjs = {
  prepare: prepare,
  stopServer: stopServer
};
var mod_testserverjs;
exports.testserverjs = mod_testserverjs;