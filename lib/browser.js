"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _version = require("./version");

var _version2 = _interopRequireDefault(_version);

var _global = require("es5-ext/global");

var _global2 = _interopRequireDefault(_global);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _globalThis;
if ((typeof globalThis === "undefined" ? "undefined" : _typeof(globalThis)) === 'object') {
	_globalThis = globalThis;
} else {
	try {
		_globalThis = _global2.default;
	} catch (error) {} finally {
		if (!_globalThis && typeof window !== 'undefined') {
			_globalThis = window;
		}
		if (!_globalThis) {
			throw new Error('Could not determine global this');
		}
	}
}

var NativeWebSocket = _globalThis.WebSocket || _globalThis.MozWebSocket;
var websocket_version = _version2.default;

/**
 * Expose a W3C WebSocket class with just one or two arguments.
 */
function W3CWebSocket(uri, protocols) {
	var native_instance;

	if (protocols) {
		native_instance = new NativeWebSocket(uri, protocols);
	} else {
		native_instance = new NativeWebSocket(uri);
	}

	/**
  * 'native_instance' is an instance of nativeWebSocket (the browser's WebSocket
  * class). Since it is an Object it will be returned as it is when creating an
  * instance of W3CWebSocket via 'new W3CWebSocket()'.
  *
  * ECMAScript 5: http://bclary.com/2004/11/07/#a-13.2.2
  */
	return native_instance;
}
if (NativeWebSocket) {
	['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'].forEach(function (prop) {
		Object.defineProperty(W3CWebSocket, prop, {
			get: function get() {
				return NativeWebSocket[prop];
			}
		});
	});
}

/**
 * Module exports.
 */
mod_browserjs = {
	'w3cwebsocket': NativeWebSocket ? W3CWebSocket : null,
	'version': websocket_version
};
var mod_browserjs;
exports.default = mod_browserjs;
module.exports = exports.default;