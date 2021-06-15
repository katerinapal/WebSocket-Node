#!/usr/bin/env node
'use strict';

var _WebSocketClient = require('../../lib/WebSocketClient');

console.log('WebSocket-Node: Test client for parsing fragmented messages.');

var args = { /* defaults */
    secure: false,
    port: '8080',
    host: '127.0.0.1',
    'no-defragment': false,
    binary: false
};

/* Parse command line options */
var pattern = /^--(.*?)(?:=(.*))?$/;
process.argv.forEach(function (value) {
    var match = pattern.exec(value);
    if (match) {
        args[match[1]] = match[2] ? match[2] : true;
    }
});

args.protocol = args.secure ? 'wss:' : 'ws:';

if (args.help) {
    console.log('Usage: ./fragmentation-test-client.js [--host=127.0.0.1] [--port=8080] [--no-defragment] [--binary]');
    console.log('');

    // return;
    process.exit();
} else {
    console.log('Use --help for usage information.');
}

var client = new _WebSocketClient.WebSocketClient({
    maxReceivedMessageSize: 128 * 1024 * 1024, // 128 MiB
    maxReceivedFrameSize: 1 * 1024 * 1024, // 1 MiB
    assembleFragments: !args['no-defragment']
});

client.on('connectFailed', function (error) {
    console.log('Client Error: ' + error.toString());
});

var requestedLength = 100;
var messageSize = 0;
var startTime;
var byteCounter;

client.on('connect', function (connection) {
    console.log('Connected');
    startTime = new Date();
    byteCounter = 0;

    connection.on('error', function (error) {
        console.log('Connection Error: ' + error.toString());
    });

    connection.on('close', function () {
        console.log('Connection Closed');
    });

    connection.on('message', function (message) {
        if (message.type === 'utf8') {
            console.log('Received utf-8 message of ' + message.utf8Data.length + ' characters.');
            logThroughput(message.utf8Data.length);
            requestData();
        } else {
            console.log('Received binary message of ' + message.binaryData.length + ' bytes.');
            logThroughput(message.binaryData.length);
            requestData();
        }
    });

    connection.on('frame', function (frame) {
        console.log('Frame: 0x' + frame.opcode.toString(16) + '; ' + frame.length + ' bytes; Flags: ' + renderFlags(frame));
        messageSize += frame.length;
        if (frame.fin) {
            console.log('Total message size: ' + messageSize + ' bytes.');
            logThroughput(messageSize);
            messageSize = 0;
            requestData();
        }
    });

    function logThroughput(numBytes) {
        byteCounter += numBytes;
        var duration = new Date().valueOf() - startTime.valueOf();
        if (duration > 1000) {
            var kiloBytesPerSecond = Math.round(byteCounter / 1024 / (duration / 1000));
            console.log('                                     Throughput: ' + kiloBytesPerSecond + ' KBps');
            startTime = new Date();
            byteCounter = 0;
        }
    }

    function sendUTFCallback(err) {
        if (err) {
            console.error('sendUTF() error: ' + err);
        }
    }

    function requestData() {
        if (args.binary) {
            connection.sendUTF('sendBinaryMessage|' + requestedLength, sendUTFCallback);
        } else {
            connection.sendUTF('sendMessage|' + requestedLength, sendUTFCallback);
        }
        requestedLength += Math.ceil(Math.random() * 1024);
    }

    function renderFlags(frame) {
        var flags = [];
        if (frame.fin) {
            flags.push('[FIN]');
        }
        if (frame.rsv1) {
            flags.push('[RSV1]');
        }
        if (frame.rsv2) {
            flags.push('[RSV2]');
        }
        if (frame.rsv3) {
            flags.push('[RSV3]');
        }
        if (frame.mask) {
            flags.push('[MASK]');
        }
        if (flags.length === 0) {
            return '---';
        }
        return flags.join(' ');
    }

    requestData();
});

if (args['no-defragment']) {
    console.log('Not automatically re-assembling fragmented messages.');
} else {
    console.log('Maximum aggregate message size: ' + client.config.maxReceivedMessageSize + ' bytes.');
}
console.log('Connecting');

client.connect(args.protocol + '//' + args.host + ':' + args.port + '/', 'fragmentation-test');