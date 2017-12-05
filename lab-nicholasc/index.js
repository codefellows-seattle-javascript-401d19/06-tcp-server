'use strict';

const winston = require('winston');

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({
      filename: 'log.json' }),

  ],
});
// winston.log('debug', 'debugger');
logger.log('info', 'hello world');
//-------------------------------------------------------
const server = require('./lib/server.js');
const PORT = 3000;

server.start(PORT, () => {});

// const events = require('events');
//
// let myEventEmitter = new events.EventEmitter();
//
// myEventEmitter.on('myEvent', () => {
//   console.log('I am reacting to an event called myEvent on line 8');
// });
// myEventEmitter.on('myEvent', () => {
//   console.log('I am reacting to an event called myEvent on line 11');
// });
// myEventEmitter.on('myEvent', () => {
//   console.log('I am reacting to an event called myEvent on line 14');
// });
//
// myEventEmitter.emit('myEvent');
