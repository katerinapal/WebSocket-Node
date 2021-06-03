import version_versionjs from "./version";
import Deprecation_Deprecation from "./Deprecation";
import W3CWebSocket_W3CWebSocket from "./W3CWebSocket";
import WebSocketConnection_WebSocketConnection from "./WebSocketConnection";
import WebSocketRequest_WebSocketRequest from "./WebSocketRequest";
import WebSocketFrame_WebSocketFrame from "./WebSocketFrame";
import WebSocketRouter_WebSocketRouter from "./WebSocketRouter";
import WebSocketClient_WebSocketClient from "./WebSocketClient";
import WebSocketServer_WebSocketServer from "./WebSocketServer";
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
export default mod_websocketjs;
