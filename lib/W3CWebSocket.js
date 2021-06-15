"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.W3CWebSocket = undefined;

var _WebSocketClient = require("./WebSocketClient");

var _typedarrayToBuffer = require("typedarray-to-buffer");

var _typedarrayToBuffer2 = _interopRequireDefault(_typedarrayToBuffer);

var _yaeti = require("yaeti");

var _yaeti2 = _interopRequireDefault(_yaeti);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mod_W3CWebSocket = W3CWebSocket;


var CONNECTING = 0;
var OPEN = 1;
var CLOSING = 2;
var CLOSED = 3;

function W3CWebSocket(url, protocols, origin, headers, requestOptions, clientConfig) {
    // Make this an EventTarget.
    _yaeti2.default.EventTarget.call(this);

    // Sanitize clientConfig.
    clientConfig = clientConfig || {};
    clientConfig.assembleFragments = true; // Required in the W3C API.

    var self = this;

    this._url = url;
    this._readyState = CONNECTING;
    this._protocol = undefined;
    this._extensions = '';
    this._bufferedAmount = 0; // Hack, always 0.
    this._binaryType = 'arraybuffer'; // TODO: Should be 'blob' by default, but Node has no Blob.

    // The WebSocketConnection instance.
    this._connection = undefined;

    // WebSocketClient instance.
    this._client = new _WebSocketClient.WebSocketClient(clientConfig);

    this._client.on('connect', function (connection) {
        onConnect.call(self, connection);
    });

    this._client.on('connectFailed', function () {
        onConnectFailed.call(self);
    });

    this._client.connect(url, protocols, origin, headers, requestOptions);
}

// Expose W3C read only attributes.
Object.defineProperties(W3CWebSocket.prototype, {
    url: { get: function get() {
            return this._url;
        } },
    readyState: { get: function get() {
            return this._readyState;
        } },
    protocol: { get: function get() {
            return this._protocol;
        } },
    extensions: { get: function get() {
            return this._extensions;
        } },
    bufferedAmount: { get: function get() {
            return this._bufferedAmount;
        } }
});

// Expose W3C write/read attributes.
Object.defineProperties(W3CWebSocket.prototype, {
    binaryType: {
        get: function get() {
            return this._binaryType;
        },
        set: function set(type) {
            // TODO: Just 'arraybuffer' supported.
            if (type !== 'arraybuffer') {
                throw new SyntaxError('just "arraybuffer" type allowed for "binaryType" attribute');
            }
            this._binaryType = type;
        }
    }
});

// Expose W3C readyState constants into the WebSocket instance as W3C states.
[['CONNECTING', CONNECTING], ['OPEN', OPEN], ['CLOSING', CLOSING], ['CLOSED', CLOSED]].forEach(function (property) {
    Object.defineProperty(W3CWebSocket.prototype, property[0], {
        get: function get() {
            return property[1];
        }
    });
});

// Also expose W3C readyState constants into the WebSocket class (not defined by the W3C,
// but there are so many libs relying on them).
[['CONNECTING', CONNECTING], ['OPEN', OPEN], ['CLOSING', CLOSING], ['CLOSED', CLOSED]].forEach(function (property) {
    Object.defineProperty(W3CWebSocket, property[0], {
        get: function get() {
            return property[1];
        }
    });
});

W3CWebSocket.prototype.send = function (data) {
    if (this._readyState !== OPEN) {
        throw new Error('cannot call send() while not connected');
    }

    // Text.
    if (typeof data === 'string' || data instanceof String) {
        this._connection.sendUTF(data);
    }
    // Binary.
    else {
            // Node Buffer.
            if (data instanceof Buffer) {
                this._connection.sendBytes(data);
            }
            // If ArrayBuffer or ArrayBufferView convert it to Node Buffer.
            else if (data.byteLength || data.byteLength === 0) {
                    data = (0, _typedarrayToBuffer2.default)(data);
                    this._connection.sendBytes(data);
                } else {
                    throw new Error('unknown binary data:', data);
                }
        }
};

W3CWebSocket.prototype.close = function (code, reason) {
    switch (this._readyState) {
        case CONNECTING:
            // NOTE: We don't have the WebSocketConnection instance yet so no
            // way to close the TCP connection.
            // Artificially invoke the onConnectFailed event.
            onConnectFailed.call(this);
            // And close if it connects after a while.
            this._client.on('connect', function (connection) {
                if (code) {
                    connection.close(code, reason);
                } else {
                    connection.close();
                }
            });
            break;
        case OPEN:
            this._readyState = CLOSING;
            if (code) {
                this._connection.close(code, reason);
            } else {
                this._connection.close();
            }
            break;
        case CLOSING:
        case CLOSED:
            break;
    }
};

/**
 * Private API.
 */

function createCloseEvent(code, reason) {
    var event = new _yaeti2.default.Event('close');

    event.code = code;
    event.reason = reason;
    event.wasClean = typeof code === 'undefined' || code === 1000;

    return event;
}

function createMessageEvent(data) {
    var event = new _yaeti2.default.Event('message');

    event.data = data;

    return event;
}

function onConnect(connection) {
    var self = this;

    this._readyState = OPEN;
    this._connection = connection;
    this._protocol = connection.protocol;
    this._extensions = connection.extensions;

    this._connection.on('close', function (code, reason) {
        onClose.call(self, code, reason);
    });

    this._connection.on('message', function (msg) {
        onMessage.call(self, msg);
    });

    this.dispatchEvent(new _yaeti2.default.Event('open'));
}

function onConnectFailed() {
    destroy.call(this);
    this._readyState = CLOSED;

    try {
        this.dispatchEvent(new _yaeti2.default.Event('error'));
    } finally {
        this.dispatchEvent(createCloseEvent(1006, 'connection failed'));
    }
}

function onClose(code, reason) {
    destroy.call(this);
    this._readyState = CLOSED;

    this.dispatchEvent(createCloseEvent(code, reason || ''));
}

function onMessage(message) {
    if (message.utf8Data) {
        this.dispatchEvent(createMessageEvent(message.utf8Data));
    } else if (message.binaryData) {
        // Must convert from Node Buffer to ArrayBuffer.
        // TODO: or to a Blob (which does not exist in Node!).
        if (this.binaryType === 'arraybuffer') {
            var buffer = message.binaryData;
            var arraybuffer = new ArrayBuffer(buffer.length);
            var view = new Uint8Array(arraybuffer);
            for (var i = 0, len = buffer.length; i < len; ++i) {
                view[i] = buffer[i];
            }
            this.dispatchEvent(createMessageEvent(arraybuffer));
        }
    }
}

function destroy() {
    this._client.removeAllListeners();
    if (this._connection) {
        this._connection.removeAllListeners();
    }
}
exports.W3CWebSocket = mod_W3CWebSocket;