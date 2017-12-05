'use strict';

require('dotenv').config();
const server = require('./lib/server');
const PORT = process.env.PORT;

server.start(PORT, () => {});
