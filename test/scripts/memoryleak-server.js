import ext_fs_fs from "fs";
import { websocketjs as libwebsocket_websocketjs } from "../../lib/websocket";
import ext_https_https from "https";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

var WebSocketServer = libwebsocket_websocketjs.server;

var activeCount = 0;

var config = { 
    key: ext_fs_fs.readFileSync( 'privatekey.pem' ), 
    cert: ext_fs_fs.readFileSync( 'certificate.pem' )  
};

var server = ext_https_https.createServer( config );

server.listen(8080, function() {
    console.log((new Date()) + ' Server is listening on port 8080 (wss)');
});

var wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false    
});

wsServer.on('request', function(request) {
    activeCount++;
    console.log('Opened from: %j\n---activeCount---: %d', request.remoteAddresses, activeCount);
    var connection = request.accept(null, request.origin);
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            setTimeout(function() {
              if (connection.connected) {
                connection.sendUTF(message.utf8Data);
              }
            }, 1000);
        }       
    });
    connection.on('close', function(reasonCode, description) {
        activeCount--;
        console.log('Closed. (' + reasonCode + ') ' + description +
                    '\n---activeCount---: ' + activeCount);
        // connection._debug.printOutput();
    });
    connection.on('error', function(error) {
        console.log('Connection error: ' + error);
    });
});

// setInterval( function(){
//     // global.gc();
//     var filename = './heapdump/'+ new Date().getTime() + '_' + activeCount + '.heapsnapshot';
//     console.log('Triggering heapdump to write to %s', filename);
//     heapdump.writeSnapshot( filename );
// }, 10000 );
// memwatch.on('leak', function(info) { console.log(info); });
