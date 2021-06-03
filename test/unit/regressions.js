import sharedstartechoserver_startEchoServer from "../shared/start-echo-server";
import libWebSocketClient_WebSocketClient from "../../lib/WebSocketClient";
import ext_tape from "tape";
var test = ext_tape;

var WebSocketClient = libWebSocketClient_WebSocketClient;
var startEchoServer = sharedstartechoserver_startEchoServer;

test('Issue 195 - passing number to connection.send() shouldn\'t throw', function(t) {
  startEchoServer(function(err, echoServer) {
    if (err) { return t.fail('Unable to start echo server: ' + err); }
    
    var client = new WebSocketClient();
    client.on('connect', function(connection) {
      t.pass('connected');
      
      t.doesNotThrow(function() {
        connection.send(12345);
      });
      
      connection.close();
      echoServer.kill();
      t.end();
    });
    
    client.on('connectFailed', function(errorDescription) {
      echoServer.kill();
      t.fail(errorDescription);
      t.end();
    });
    
    client.connect('ws://localhost:8080', null);
  });
});
