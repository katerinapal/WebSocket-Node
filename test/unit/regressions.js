import ext_test from "tape";
import { WebSocketClient as WebSocketClient_WebSocketClient } from "../../lib/WebSocketClient";
import { startEchoServer as startechoserver_startEchoServer } from "../shared/start-echo-server";

ext_test('Issue 195 - passing number to connection.send() shouldn\'t throw', function(t) {
  startechoserver_startEchoServer(function(err, echoServer) {
    if (err) { return t.fail('Unable to start echo server: ' + err); }
    
    var client = new WebSocketClient_WebSocketClient();
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
