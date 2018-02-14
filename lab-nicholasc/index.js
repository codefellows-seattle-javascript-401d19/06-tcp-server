'use strict';

const winston = require('winston');

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({
      filename: 'log.json' }),

  ],
});
logger.log('info', 'hello world');
//-------------------------------------------------------
const server = require('./lib/server.js');
const PORT = 3000;

server.start(PORT, () => {});
