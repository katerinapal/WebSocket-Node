import ext_http_http from "http";
import { WebSocketServer as WebSocketServer_WebSocketServer } from "../../lib/WebSocketServer";

var server;
var wsServer;

function prepare(callback) {
  if (typeof(callback) !== 'function') { callback = function(){}; }
  server = ext_http_http.createServer(function(request, response) {
    response.writeHead(404);
    response.end();
  });

  wsServer = new WebSocketServer_WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false,
    maxReceivedFrameSize: 64*1024*1024,   // 64MiB
    maxReceivedMessageSize: 64*1024*1024, // 64MiB
    fragmentOutgoingMessages: false,
    keepalive: false,
    disableNagleAlgorithm: false
  });

  server.listen(64321, function(err) {
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
  }
  catch(e) {
    console.warn('stopServer threw', e);
  }
}

mod_testserverjs = {
  prepare: prepare,
  stopServer: stopServer
};
var mod_testserverjs;
export { mod_testserverjs as testserverjs };
