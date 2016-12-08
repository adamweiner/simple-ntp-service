/*
consumer.js - Consumer module for use in Simple NTP Service
*/

var io = require('socket.io-client');

module.exports = function Consumer(id, host, port, lifetime) {
  var options = { 'force new connection': true }; // force each Consumer socket to have a unique id
  var ioConsumer = io.connect('http://' + host + ':' + port, options);
  var keepAliveCount = 0;
  var keepAliveInterval = setInterval(keepAlive, 5000); // send KeepAlive every 5 seconds
  
  function keepAlive() {
    // send KeepAlive liftime times
    if (keepAliveCount++ != lifetime) {
      ioConsumer.emit('KeepAlive');
    } else {
      clearInterval(keepAliveInterval);
    }
  }
  
  ioConsumer.emit('Register');
  
  ioConsumer.on('Time', function(time) {
    console.info('Consumer ' + id + ' recieved: ' + time);
  });
};
