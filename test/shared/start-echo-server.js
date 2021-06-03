"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _child_process = require("child_process");

var _child_process2 = _interopRequireDefault(_child_process);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mod_startEchoServer = startEchoServer;


function startEchoServer(outputStream, callback) {
  if ('function' === typeof outputStream) {
    callback = outputStream;
    outputStream = null;
  }
  if ('function' !== typeof callback) {
    callback = function callback() {};
  }

  var path = _path2.default.join(__dirname + '/../scripts/echo-server.js');

  console.log(path);

  var echoServer = _child_process2.default.spawn('node', [path]);

  var state = 'starting';

  var processProxy = {
    kill: function kill(signal) {
      state = 'exiting';
      echoServer.kill(signal);
    }
  };

  if (outputStream) {
    echoServer.stdout.pipe(outputStream);
    echoServer.stderr.pipe(outputStream);
  }

  echoServer.stdout.on('data', function (chunk) {
    chunk = chunk.toString();
    if (/Server is listening/.test(chunk)) {
      if (state === 'starting') {
        state = 'ready';
        callback(null, processProxy);
      }
    }
  });

  echoServer.on('exit', function (code, signal) {
    echoServer = null;
    if (state !== 'exiting') {
      state = 'exited';
      callback(new Error('Echo Server exited unexpectedly with code ' + code));
      process.exit(1);
    }
  });

  process.on('exit', function () {
    if (echoServer && state === 'ready') {
      echoServer.kill();
    }
  });
}
exports.default = mod_startEchoServer;
module.exports = exports.default;