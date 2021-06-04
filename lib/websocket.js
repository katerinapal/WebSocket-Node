"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.websocketjs = undefined;

var _WebSocketServer = require("./WebSocketServer");

var _WebSocketClient = require("./WebSocketClient");

var _WebSocketRouter = require("./WebSocketRouter");

var _WebSocketFrame = require("./WebSocketFrame");

var _WebSocketRequest = require("./WebSocketRequest");

var _WebSocketConnection = require("./WebSocketConnection");

var _W3CWebSocket = require("./W3CWebSocket");

var _Deprecation = require("./Deprecation");

var _version = require("./version");

exports.websocketjs = mod_websocketjs = {
    'server': _WebSocketServer.WebSocketServer,
    'client': _WebSocketClient.WebSocketClient,
    'router': _WebSocketRouter.WebSocketRouter,
    'frame': _WebSocketFrame.WebSocketFrame,
    'request': _WebSocketRequest.WebSocketRequest,
    'connection': _WebSocketConnection.WebSocketConnection,
    'w3cwebsocket': _W3CWebSocket.W3CWebSocket,
    'deprecation': _Deprecation.Deprecation,
    'version': _version.versionjs
};
var mod_websocketjs;
exports.websocketjs = mod_websocketjs;