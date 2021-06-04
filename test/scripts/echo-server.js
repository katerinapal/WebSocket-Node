#!/usr/bin/env node
"use strict";

var _WebSocketServer = require("../../lib/WebSocketServer");

var _http = require("http");

var _http2 = _interopRequireDefault(_http);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var args = { /* defaults */
    port: '8080',
    debug: false
};

/* Parse command line options */
var pattern = /^--(.*?)(?:=(.*))?$/;
process.argv.forEach(function (value) {
    var match = pattern.exec(value);
    if (match) {
        args[match[1]] = match[2] ? match[2] : true;
    }
});

var port = parseInt(args.port, 10);
var debug = args.debug;

console.log('WebSocket-Node: echo-server');
console.log('Usage: ./echo-server.js [--port=8080] [--debug]');

var server = _http2.default.createServer(function (request, response) {
    if (debug) {
        console.log(new Date() + ' Received request for ' + request.url);
    }
    response.writeHead(404);
    response.end();
});
server.listen(port, function () {
    console.log(new Date() + ' Server is listening on port ' + port);
});

var wsServer = new _WebSocketServer.WebSocketServer({
    httpServer: server,
    autoAcceptConnections: true,
    maxReceivedFrameSize: 64 * 1024 * 1024, // 64MiB
    maxReceivedMessageSize: 64 * 1024 * 1024, // 64MiB
    fragmentOutgoingMessages: false,
    keepalive: false,
    disableNagleAlgorithm: false
});

wsServer.on('connect', function (connection) {
    if (debug) {
        console.log(new Date() + ' Connection accepted' + ' - Protocol Version ' + connection.webSocketVersion);
    }
    function sendCallback(err) {
        if (err) {
            console.error('send() error: ' + err);
            connection.drop();
            setTimeout(function () {
                process.exit(100);
            }, 100);
        }
    }
    connection.on('message', function (message) {
        if (message.type === 'utf8') {
            if (debug) {
                console.log('Received utf-8 message of ' + message.utf8Data.length + ' characters.');
            }
            connection.sendUTF(message.utf8Data, sendCallback);
        } else if (message.type === 'binary') {
            if (debug) {
                console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            }
            connection.sendBytes(message.binaryData, sendCallback);
        }
    });
    connection.on('close', function (reasonCode, description) {
        if (debug) {
            console.log(new Date() + ' Peer ' + connection.remoteAddress + ' disconnected.');
        }
        connection._debug.printOutput();
    });
});