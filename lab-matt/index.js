'use strict';

const server = require('./lib/server');
const PORT = process.env.PORT;

server.start(PORT, () => {

});


// `logger` ------------------------------------------------------------
// const winston = require('winston');


// let logger = new (winston.Logger)({
//   transports: [
//     new (winston.transports.Console)(),
//     new (winston.transports.File)({ filename: 'log.json'}),
//   ],
// });


// winston.level = 'debug';
// logger.log('info', 'hello world');


// `events` ------------------------------------------------------------
// const events = require('events');

// let myEventEmitter = new events. EventEmitter();
// // mattL - other method, but doesn't work with node
// // let myEventEmitter = events.create();

// myEventEmitter.on('myEvent', () => {
//   console.log('I am reacting to an event on line 9');
// });

// myEventEmitter.on('myEvent', () => {
//   console.log('I am reacting to an event on line 13');
// });


// myEventEmitter.emit('asdfklajsdf'); // mattL - does nothing since no event is connected to <asdfklajsdf>
// myEventEmitter.emit('myEvent'); // mattL - connects to, and runs the events listed at line 9 and line 13
