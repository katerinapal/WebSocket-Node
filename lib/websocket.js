import { WebSocketServer as WebSocketServer_WebSocketServer } from "./WebSocketServer";
import { WebSocketClient as WebSocketClient_WebSocketClient } from "./WebSocketClient";
import { WebSocketRouter as WebSocketRouter_WebSocketRouter } from "./WebSocketRouter";
import { WebSocketFrame as WebSocketFrame_WebSocketFrame } from "./WebSocketFrame";
import { WebSocketRequest as WebSocketRequest_WebSocketRequest } from "./WebSocketRequest";
import { WebSocketConnection as WebSocketConnection_WebSocketConnection } from "./WebSocketConnection";
import { W3CWebSocket as W3CWebSocket_W3CWebSocket } from "./W3CWebSocket";
import { Deprecation as Deprecation_Deprecation } from "./Deprecation";
import { versionjs as version_versionjs } from "./version";
mod_websocketjs = {
    'server'       : WebSocketServer_WebSocketServer,
    'client'       : WebSocketClient_WebSocketClient,
    'router'       : WebSocketRouter_WebSocketRouter,
    'frame'        : WebSocketFrame_WebSocketFrame,
    'request'      : WebSocketRequest_WebSocketRequest,
    'connection'   : WebSocketConnection_WebSocketConnection,
    'w3cwebsocket' : W3CWebSocket_W3CWebSocket,
    'deprecation'  : Deprecation_Deprecation,
    'version'      : version_versionjs
};
var mod_websocketjs;
export { mod_websocketjs as websocketjs };
