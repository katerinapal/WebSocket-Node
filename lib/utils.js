import ext_debug from "debug";
import ext_events from "events";
var noop = mod_noop = function(){};

mod_extend = function extend(dest, source) {
    for (var prop in source) {
        dest[prop] = source[prop];
    }
};

mod_eventEmitterListenerCount =
    ext_events.EventEmitter.listenerCount ||
    function(emitter, type) { return emitter.listeners(type).length; };

mod_bufferAllocUnsafe = Buffer.allocUnsafe ?
    Buffer.allocUnsafe :
    function oldBufferAllocUnsafe(size) { return new Buffer(size); };

mod_bufferFromString = Buffer.from ?
    Buffer.from :
    function oldBufferFromString(string, encoding) {
      return new Buffer(string, encoding);
    };

mod_BufferingLogger = function createBufferingLogger(identifier, uniqueID) {
    var logFunction = ext_debug(identifier);
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

BufferingLogger.prototype.log = function() {
  this.buffer.push([ new Date(), Array.prototype.slice.call(arguments) ]);
  return this;
};

BufferingLogger.prototype.clear = function() {
  this.buffer = [];
  return this;
};

BufferingLogger.prototype.printOutput = function(logFunction) {
    if (!logFunction) { logFunction = this.logFunction; }
    var uniqueID = this.uniqueID;
    this.buffer.forEach(function(entry) {
        var date = entry[0].toLocaleString();
        var args = entry[1].slice();
        var formatString = args[0];
        if (formatString !== (void 0) && formatString !== null) {
            formatString = '%s - %s - ' + formatString.toString();
            args.splice(0, 1, formatString, date, uniqueID);
            logFunction.apply(global, args);
        }
    });
};
var mod_noop;
export { mod_noop as noop };
var mod_extend;
export { mod_extend as extend };
var mod_eventEmitterListenerCount;
export { mod_eventEmitterListenerCount as eventEmitterListenerCount };
var mod_bufferAllocUnsafe;
export { mod_bufferAllocUnsafe as bufferAllocUnsafe };
var mod_bufferFromString;
export { mod_bufferFromString as bufferFromString };
var mod_BufferingLogger;
export { mod_BufferingLogger as BufferingLogger };
