# simple-ntp-service
One Producer, multiple Consumers. The Producer sends timestamps to every registered Consumer once a second. Each Consumer first registers with the Producer to start receiving timestamps. It then sends KeepAlive messages indicating that it would like to keep receiving the timestamps from the Producer. Every Consumer will send k KeepAlive messages at 5 second intervals, where k is a random integer on the interval [0, 12]. The Producer will stop sending timestamps to a specific Consumer when it has not received a KeepAlive message from that Consumer in the last 10 seconds.

### Dependencies
Built on Node.js

Required packages:
* socket.io (https://www.npmjs.com/package/socket.io)
* socket.io-client (https://www.npmjs.com/package/socket.io-client)

### Usage
*node simple-ntp.js [desired number of consumers]*

### Tests
Some tests provided in *tests.js*.

Usage: *node tests.js*

The first three tests make sure the application handles bad input correctly.
An additional test spawns 3 Consumers, where one is expected to receive messages for the longest period of time. The other two are expected to stop receiving messages at the same time. This can be observed, then the tester exits.

### Design Decisions
* socket.io was chosen due to its quick setup and ability to identify individual sockets - essential for this application
* *producer.js* and *consumer.js* implemented as modules to allow for easier potential expansion
* The number of Consumers provided via command line argument must be an integer greater than zero
* Producer will run until the process is killed

### Potential Improvements
* In addition to stopping the KeepAlive messages, the Consumers can disconnect themselves once they have sent the appropriate number of KeepAlive messages to the Producer
* The producer can shut itself down after some period of time where it has not received a KeepAlive message
* Once I began writing tests it became clear that my implementation is not the easiest to test. For example, there is no support for spawning a Consumer and forcing it to send an individual KeepAlive message that can be tested. Instead, all KeepAlive messages are scheduled and processed within the Consumer's constructor. In the interest of time I did not totally rewrite the application to remedy this and as a result my approach to the tests provided with this application is a bit unorthodox.
