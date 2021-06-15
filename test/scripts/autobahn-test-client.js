#!/usr/bin/env node
import { WebSocketClient as WebSocketClient_WebSocketClient } from "../../lib/WebSocketClient";
import { websocketjs as libwebsocket_websocketjs } from "../../lib/websocket";
import ext_querystring_querystring from "querystring";
var wsVersion = libwebsocket_websocketjs.version;

var args = { /* defaults */
    secure: false,
    port: '9000',
    host: 'localhost'
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

console.log('WebSocket-Node: Echo test client for running against the Autobahn test suite');
console.log('Usage: ./libwebsockets-test-client.js --host=127.0.0.1 --port=9000 [--secure]');
console.log('');


console.log('Starting test run.');

getCaseCount(function(caseCount) {
    var currentCase = 1;
    runNextTestCase();
    
    function runNextTestCase() {
        runTestCase(currentCase++, caseCount, function() {
            if (currentCase <= caseCount) {
                process.nextTick(runNextTestCase);
            }
            else {
                process.nextTick(function() {
                    console.log('Test suite complete, generating report.');
                    updateReport(function() {
                        console.log('Report generated.');
                    });
                });
            }
        });
    }
});


function runTestCase(caseIndex, caseCount, callback) {
    console.log('Running test ' + caseIndex + ' of ' + caseCount);
    var echoClient = new WebSocketClient_WebSocketClient({
        maxReceivedFrameSize: 64*1024*1024,   // 64MiB
        maxReceivedMessageSize: 64*1024*1024, // 64MiB
        fragmentOutgoingMessages: false,
        keepalive: false,
        disableNagleAlgorithm: false
    });

    echoClient.on('connectFailed', function(error) {
        console.log('Connect Error: ' + error.toString());
    });

    echoClient.on('connect', function(connection) {
        connection.on('error', function(error) {
            console.log('Connection Error: ' + error.toString());
        });
        connection.on('close', function() {
            callback();
        });
        connection.on('message', function(message) {
            if (message.type === 'utf8') {
                connection.sendUTF(message.utf8Data);
            }
            else if (message.type === 'binary') {
                connection.sendBytes(message.binaryData);
            }
        });
    });
    
    var qs = ext_querystring_querystring.stringify({
        case: caseIndex,
        agent: 'WebSocket-Node Client v' + wsVersion
    });
    echoClient.connect('ws://' + args.host + ':' + args.port + '/runCase?' + qs, []);
}

function getCaseCount(callback) {
    var client = new WebSocketClient_WebSocketClient();
    var caseCount = NaN;
    client.on('connect', function(connection) {
        connection.on('close', function() {
            callback(caseCount);
        });
        connection.on('message', function(message) {
            if (message.type === 'utf8') {
                console.log('Got case count: ' + message.utf8Data);
                caseCount = parseInt(message.utf8Data, 10);
            }
            else if (message.type === 'binary') {
                throw new Error('Unexpected binary message when retrieving case count');
            }
        });
    });
    client.connect('ws://' + args.host + ':' + args.port + '/getCaseCount', []);
}

function updateReport(callback) {
    var client = new WebSocketClient_WebSocketClient();
    var qs = ext_querystring_querystring.stringify({
        agent: 'WebSocket-Node Client v' + wsVersion
    });
    client.on('connect', function(connection) {
        connection.on('close', callback);
    });
    client.connect('ws://localhost:9000/updateReports?' + qs);
}
