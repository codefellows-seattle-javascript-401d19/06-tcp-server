import { request } from 'https';

'use strict';

// const events = require('events');

// let myEventEmitter = new events.EventEmitter();

// myEventEmitter.on('myEvent', () => {
//     console.log('I ma reacting to an even on Line 8');
// });

// myEventEmitter.on('myEvent', () => {
//     console.log('I am reacting to an event on Line 12');
// });

// myEventEmitter.emit('random text'); // emit is a node function

const server = require('.lib/server');
const PORT = 3000;

server.start(PORT, () => {}); //no magic numbers like port number!
