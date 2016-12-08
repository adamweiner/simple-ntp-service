/*
producer.js - Producer module for use in Simple NTP Service
*/

var io = require('socket.io');
var consumers = {};
var consumerCount = 0;

function sendTime() {
  for (var id in consumers) {
    // only send timestamp to "alive" Consumers
    if ((Date.now() - consumers[id].keepAlive) >= 10000) {
      delete consumers[id];
    } else {
      consumers[id].socket.emit('Time', Date.now());
    }
  }
}

// initialize Producer, accept Register and KeepAlive messages
module.exports.init = function(port) {
  var ioProducer = io.listen(port);
  
  ioProducer.on('connection', function(socket) {
    socket.on('Register', function() {
      consumers[consumerCount++] = {
        socket: socket,
        keepAlive: Date.now()
      };
    });
    
    socket.on('KeepAlive', function() {
      for (var id in consumers) {
        // confirm identity with socket
        if (socket == consumers[id].socket) {
          consumers[id].keepAlive = Date.now();
        }
      }
    });
  });
};

// start sending timestamps
module.exports.start = function() {
  // send timestamp every second
  setInterval(sendTime, 1000);
};
