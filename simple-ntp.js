/*
simple-ntp.js - Initiates Simple NTP Service
  Requires: producer.js, consumer.js
  Usage: node simple-ntp.js [number of consumers]
*/

var host = '127.0.0.1';
var port = 1337;
var intRegex = /^\d+$/;
var consumers = [];
var Producer = require('./producer.js');
var Consumer = require('./consumer.js');

if (process.argv[2] === undefined) {
  console.error('Usage: ' + process.argv[0] + ' ' + process.argv[1] + ' [number of consumers]');
  return;
}

if (!intRegex.test(process.argv[2]) || process.argv[2] < 1) {
  console.error('Invalid number of consumers provided, must be an interger greater than zero.');
  return;
}

// initialize Producer and start sending timestamps
Producer.init(port);
Producer.start();

// run provided number of Consumers
for (var i = 0; i < process.argv[2]; i++) {
  var lifetime = Math.floor(Math.random() * 11) + 1; // random lifetime between 1 - 11 (inclusive)
  consumers.push(new Consumer(i, host, port, lifetime));
}
