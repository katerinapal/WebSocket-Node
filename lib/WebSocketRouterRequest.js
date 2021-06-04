"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.WebSocketRouterRequest = undefined;

var _util = require("util");

var _util2 = _interopRequireDefault(_util);

var _events = require("events");

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mod_WebSocketRouterRequest = WebSocketRouterRequest;

var EventEmitter = _events2.default.EventEmitter;

function WebSocketRouterRequest(webSocketRequest, resolvedProtocol) {
    // Superclass Constructor
    EventEmitter.call(this);

    this.webSocketRequest = webSocketRequest;
    if (resolvedProtocol === '____no_protocol____') {
        this.protocol = null;
    } else {
        this.protocol = resolvedProtocol;
    }
    this.origin = webSocketRequest.origin;
    this.resource = webSocketRequest.resource;
    this.resourceURL = webSocketRequest.resourceURL;
    this.httpRequest = webSocketRequest.httpRequest;
    this.remoteAddress = webSocketRequest.remoteAddress;
    this.webSocketVersion = webSocketRequest.webSocketVersion;
    this.requestedExtensions = webSocketRequest.requestedExtensions;
    this.cookies = webSocketRequest.cookies;
}

_util2.default.inherits(WebSocketRouterRequest, EventEmitter);

WebSocketRouterRequest.prototype.accept = function (origin, cookies) {
    var connection = this.webSocketRequest.accept(this.protocol, origin, cookies);
    this.emit('requestAccepted', connection);
    return connection;
};

WebSocketRouterRequest.prototype.reject = function (status, reason, extraHeaders) {
    this.webSocketRequest.reject(status, reason, extraHeaders);
    this.emit('requestRejected', this);
};

exports.WebSocketRouterRequest = mod_WebSocketRouterRequest;