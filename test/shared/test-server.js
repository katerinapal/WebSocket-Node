"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _WebSocketServer = require("../../lib/WebSocketServer");

var _WebSocketServer2 = _interopRequireDefault(_WebSocketServer);

var _http = require("http");

var _http2 = _interopRequireDefault(_http);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var http = _http2.default;
var WebSocketServer = _WebSocketServer2.default;

var server;
var wsServer;

function prepare(callback) {
  if (typeof callback !== 'function') {
    callback = function callback() {};
  }
  server = http.createServer(function (request, response) {
    response.writeHead(404);
    response.end();
  });

  wsServer = new WebSocketServer({
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

mod_testserverjs = {
  prepare: prepare,
  stopServer: stopServer
};
var mod_testserverjs;
exports.default = mod_testserverjs;
module.exports = exports.default;