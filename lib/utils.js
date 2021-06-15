"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.noop = exports.BufferingLogger = exports.bufferFromString = exports.bufferAllocUnsafe = exports.eventEmitterListenerCount = exports.extend = undefined;

var _events = require("events");

var _events2 = _interopRequireDefault(_events);

var _debug = require("debug");

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var noop = exports.noop = mod_noop = function mod_noop() {};

exports.extend = mod_extend = function extend(dest, source) {
    for (var prop in source) {
        dest[prop] = source[prop];
    }
};

exports.eventEmitterListenerCount = mod_eventEmitterListenerCount = _events2.default.EventEmitter.listenerCount || function (emitter, type) {
    return emitter.listeners(type).length;
};

exports.bufferAllocUnsafe = mod_bufferAllocUnsafe = Buffer.allocUnsafe ? Buffer.allocUnsafe : function oldBufferAllocUnsafe(size) {
    return new Buffer(size);
};

exports.bufferFromString = mod_bufferFromString = Buffer.from ? Buffer.from : function oldBufferFromString(string, encoding) {
    return new Buffer(string, encoding);
};

exports.BufferingLogger = mod_BufferingLogger = function createBufferingLogger(identifier, uniqueID) {
    var logFunction = (0, _debug2.default)(identifier);
    if (logFunction.enabled) {
        var logger = new BufferingLogger(identifier, uniqueID, logFunction);
        var debug = logger.log.bind(logger);
        debug.printOutput = logger.printOutput.bind(logger);
        debug.enabled = logFunction.enabled;
        return debug;
    }
    logFunction.printOutput = noop;
    return logFunction;
};

function BufferingLogger(identifier, uniqueID, logFunction) {
    this.logFunction = logFunction;
    this.identifier = identifier;
    this.uniqueID = uniqueID;
    this.buffer = [];
}

BufferingLogger.prototype.log = function () {
    this.buffer.push([new Date(), Array.prototype.slice.call(arguments)]);
    return this;
};

BufferingLogger.prototype.clear = function () {
    this.buffer = [];
    return this;
};

BufferingLogger.prototype.printOutput = function (logFunction) {
    if (!logFunction) {
        logFunction = this.logFunction;
    }
    var uniqueID = this.uniqueID;
    this.buffer.forEach(function (entry) {
        var date = entry[0].toLocaleString();
        var args = entry[1].slice();
        var formatString = args[0];
        if (formatString !== void 0 && formatString !== null) {
            formatString = '%s - %s - ' + formatString.toString();
            args.splice(0, 1, formatString, date, uniqueID);
            logFunction.apply(global, args);
        }
    });
};
var mod_extend;
exports.extend = mod_extend;

var mod_eventEmitterListenerCount;
exports.eventEmitterListenerCount = mod_eventEmitterListenerCount;

var mod_bufferAllocUnsafe;
exports.bufferAllocUnsafe = mod_bufferAllocUnsafe;

var mod_bufferFromString;
exports.bufferFromString = mod_bufferFromString;

var mod_BufferingLogger;
exports.BufferingLogger = mod_BufferingLogger;

var mod_noop;
exports.noop = mod_noop;