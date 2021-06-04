#!/usr/bin/env node
"use strict";

var _WebSocketServer = require("../../lib/WebSocketServer");

var _WebSocketRouter = require("../../lib/WebSocketRouter");

var _utils = require("../../lib/utils");

var _http = require("http");

var _http2 = _interopRequireDefault(_http);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log('WebSocket-Node: Test server to spit out fragmented messages.');

var args = {
    'no-fragmentation': false,
    'fragment': '16384',
    'port': '8080'
};

/* Parse command line options */
var pattern = /^--(.*?)(?:=(.*))?$/;
process.argv.forEach(function (value) {
    var match = pattern.exec(value);
    if (match) {
        args[match[1]] = match[2] ? match[2] : true;
    }
});

args.protocol = 'ws:';

if (args.help) {
    console.log('Usage: ./fragmentation-test-server.js [--port=8080] [--fragment=n] [--no-fragmentation]');
    console.log('');

    // return;
    process.exit();
} else {
    console.log('Use --help for usage information.');
}

var server = _http2.default.createServer(function (request, response) {
    console.log(new Date() + ' Received request for ' + request.url);
    if (request.url === '/') {
        _fs2.default.readFile('fragmentation-test-page.html', 'utf8', function (err, data) {
            if (err) {
                response.writeHead(404);
                response.end();
            } else {
                response.writeHead(200, {
                    'Content-Type': 'text/html'
                });
                response.end(data);
            }
        });
    } else {
        response.writeHead(404);
        response.end();
    }
});
server.listen(args.port, function () {
    console.log(new Date() + ' Server is listening on port ' + args.port);
});

var wsServer = new _WebSocketServer.WebSocketServer({
    httpServer: server,
    fragmentOutgoingMessages: !args['no-fragmentation'],
    fragmentationThreshold: parseInt(args['fragment'], 10)
});

var router = new _WebSocketRouter.WebSocketRouter();
router.attachServer(wsServer);

var lorem = 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.';

router.mount('*', 'fragmentation-test', function (request) {
    var connection = request.accept(request.origin);
    console.log(new Date() + ' connection accepted from ' + connection.remoteAddress);

    connection.on('message', function (message) {
        function sendCallback(err) {
            if (err) {
                console.error('send() error: ' + err);
            }
        }
        if (message.type === 'utf8') {
            var length = 0;
            var match = /sendMessage\|(\d+)/.exec(message.utf8Data);
            var requestedLength;
            if (match) {
                requestedLength = parseInt(match[1], 10);
                var longLorem = '';
                while (length < requestedLength) {
                    longLorem += '  ' + lorem;
                    length = Buffer.byteLength(longLorem);
                }
                longLorem = longLorem.slice(0, requestedLength);
                length = Buffer.byteLength(longLorem);
                if (length > 0) {
                    connection.sendUTF(longLorem, sendCallback);
                    console.log(new Date() + ' sent ' + length + ' byte utf-8 message to ' + connection.remoteAddress);
                }
                return;
            }

            match = /sendBinaryMessage\|(\d+)/.exec(message.utf8Data);
            if (match) {
                requestedLength = parseInt(match[1], 10);

                // Generate random binary data.
                var buffer = (0, _utils.bufferAllocUnsafe)(requestedLength);
                for (var i = 0; i < requestedLength; i++) {
                    buffer[i] = Math.ceil(Math.random() * 255);
                }

                connection.sendBytes(buffer, sendCallback);
                console.log(new Date() + ' sent ' + buffer.length + ' byte binary message to ' + connection.remoteAddress);
                return;
            }
        }
    });

    connection.on('close', function (reasonCode, description) {
        console.log(new Date() + ' peer ' + connection.remoteAddress + ' disconnected.');
    });

    connection.on('error', function (error) {
        console.log('Connection error for peer ' + connection.remoteAddress + ': ' + error);
    });
});

console.log('Point your WebSocket Protocol Version 8 compliant browser at http://localhost:' + args.port + '/');
if (args['no-fragmentation']) {
    console.log('Fragmentation disabled.');
} else {
    console.log('Fragmenting messages at ' + wsServer.config.fragmentationThreshold + ' bytes');
}