"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _version = require("./version");

var _version2 = _interopRequireDefault(_version);

var _Deprecation = require("./Deprecation");

var _Deprecation2 = _interopRequireDefault(_Deprecation);

var _W3CWebSocket = require("./W3CWebSocket");

var _W3CWebSocket2 = _interopRequireDefault(_W3CWebSocket);

var _WebSocketConnection = require("./WebSocketConnection");

var _WebSocketConnection2 = _interopRequireDefault(_WebSocketConnection);

var _WebSocketRequest = require("./WebSocketRequest");

var _WebSocketRequest2 = _interopRequireDefault(_WebSocketRequest);

var _WebSocketFrame = require("./WebSocketFrame");

var _WebSocketFrame2 = _interopRequireDefault(_WebSocketFrame);

var _WebSocketRouter = require("./WebSocketRouter");

var _WebSocketRouter2 = _interopRequireDefault(_WebSocketRouter);

var _WebSocketClient = require("./WebSocketClient");

var _WebSocketClient2 = _interopRequireDefault(_WebSocketClient);

var _WebSocketServer = require("./WebSocketServer");

var _WebSocketServer2 = _interopRequireDefault(_WebSocketServer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

mod_websocketjs = {
    'server': _WebSocketServer2.default,
    'client': _WebSocketClient2.default,
    'router': _WebSocketRouter2.default,
    'frame': _WebSocketFrame2.default,
    'request': _WebSocketRequest2.default,
    'connection': _WebSocketConnection2.default,
    'w3cwebsocket': _W3CWebSocket2.default,
    'deprecation': _Deprecation2.default,
    'version': _version2.default
};
var mod_websocketjs;
exports.default = mod_websocketjs;
module.exports = exports.default;