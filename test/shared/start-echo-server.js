var mod_startEchoServer = startEchoServer;
import ext_child_process from "child_process";
import ext_path from "path";

function startEchoServer(outputStream, callback) {
  if ('function' === typeof outputStream) {
    callback = outputStream;
    outputStream = null;
  }
  if ('function' !== typeof callback) {
    callback = function(){};
  }
  
  var path = ext_path.join(__dirname + '/../scripts/echo-server.js');
  
  console.log(path);
    
  var echoServer = ext_child_process.spawn('node', [ path ]);
  
  var state = 'starting';
  
  var processProxy = {
    kill: function(signal) {
      state = 'exiting';
      echoServer.kill(signal);
    }
  };
  
  if (outputStream) {
    echoServer.stdout.pipe(outputStream);
    echoServer.stderr.pipe(outputStream);
  }
  
  echoServer.stdout.on('data', function(chunk) {
    chunk = chunk.toString();
    if (/Server is listening/.test(chunk)) {
      if (state === 'starting') {
        state = 'ready';
        callback(null, processProxy);
      }
    }
  });

  echoServer.on('exit', function(code, signal) {
    echoServer = null;
    if (state !== 'exiting') {
      state = 'exited';
      callback(new Error('Echo Server exited unexpectedly with code ' + code));
      process.exit(1);
    }
  });

  process.on('exit', function() {
    if (echoServer && state === 'ready') {
      echoServer.kill();
    }
  });
}
export default mod_startEchoServer;
