#!/usr/bin/env node
import { WebSocketClient as WebSocketClient_WebSocketClient } from "../../lib/WebSocketClient";

var args = { /* defaults */
    secure: false,
    version: 13
};

/* Parse command line options */
var pattern = /^--(.*?)(?:=(.*))?$/;
process.argv.forEach(function(value) {
    var match = pattern.exec(value);
    if (match) {
        args[match[1]] = match[2] ? match[2] : true;
    }
});

args.protocol = args.secure ? 'wss:' : 'ws:';
args.version = parseInt(args.version, 10);

if (!args.host || !args.port) {
    console.log('WebSocket-Node: Test client for Andy Green\'s libwebsockets-test-server');
    console.log('Usage: ./libwebsockets-test-client.js --host=127.0.0.1 --port=8080 [--version=8|13] [--secure]');
    console.log('');

    // return;
    process.exit();
}

var mirrorClient = new WebSocketClient_WebSocketClient({
    webSocketVersion: args.version
});

mirrorClient.on('connectFailed', function(error) {
    console.log('Connect Error: ' + error.toString());
});

mirrorClient.on('connect', function(connection) {
    console.log('lws-mirror-protocol connected');
    connection.on('error', function(error) {
        console.log('Connection Error: ' + error.toString());
    });
    connection.on('close', function() {
        console.log('lws-mirror-protocol Connection Closed');
    });  
    function sendCallback(err) {
        if (err) { console.error('send() error: ' + err); }
    }
    function spamCircles() {
        if (connection.connected) {
            // c #7A9237 487 181 14;
            var color = 0x800000 + Math.round(Math.random() * 0x7FFFFF);
            var x = Math.round(Math.random() * 502);
            var y = Math.round(Math.random() * 306);
            var radius = Math.round(Math.random() * 30);
            connection.send('c #' + color.toString(16) + ' ' + x + ' ' + y + ' ' + radius + ';', sendCallback);
            setTimeout(spamCircles, 10);
        }
    }
    spamCircles();
});

mirrorClient.connect(args.protocol + '//' + args.host + ':' + args.port + '/', 'lws-mirror-protocol');


var incrementClient = new WebSocketClient_WebSocketClient({
    webSocketVersion: args.version
});

incrementClient.on('connectFailed', function(error) {
    console.log('Connect Error: ' + error.toString());
});

incrementClient.on('connect', function(connection) {
    console.log('dumb-increment-protocol connected');
    connection.on('error', function(error) {
        console.log('Connection Error: ' + error.toString());
    });
    connection.on('close', function() {
        console.log('dumb-increment-protocol Connection Closed');
    });
    connection.on('message', function(message) {
        console.log('Number: \'' + message.utf8Data + '\'');
    });
});

incrementClient.connect(args.protocol + '//' + args.host + ':' + args.port + '/', 'dumb-increment-protocol');
