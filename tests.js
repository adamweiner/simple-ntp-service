/*
tests.js - Some tests validating Simple NTP Service
*/

var child = require('child_process');
var assert = require('assert');
var host = '127.0.0.1';
var port = 1337;
var Producer = require('./producer.js');
var Consumer = require('./consumer.js');

// confirm Usage statment returned when no number of Consumers is provided
child.exec('node simple-ntp.js',
  function(error, stdout, stderr) {
    assert.equal(stderr.indexOf('Usage'), 0);
});

// confirm error messages when invalid number of Consumers is provided
child.exec('node simple-ntp.js -1',
  function(error, stdout, stderr) {
    assert.equal(stderr.indexOf('Invalid'), 0);
});

child.exec('node simple-ntp.js consumer',
  function(error, stdout, stderr) {
    assert.equal(stderr.indexOf('Invalid'), 0);
});

// run Producer and three Consumers, confirm Consumer 2 is the last Consumer to receive timestamps
Producer.init(port);
Producer.start();
console.info('Consumer 2 should be the last consumer standing:');
Consumer(0, host, port, 1);
Consumer(1, host, port, 1);
Consumer(2, host, port, 2); // longest lifetime
setTimeout(die, 25000);

function die() {
  process.exit();
}
