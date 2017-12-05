'use strict';

const net = require('net');
const winston = require('winston');
const faker = require('faker');
const Client = require('./client');
const app = net.createServer();

const chatRoomName = faker.company.catchPhrase();

let logger = new (winston.Logger)({
  transports: [
    new (winston.transports.File)({filename: 'log.json'}),
  ],
});

app.on('connection', socket => {
  let currentClient = new Client(socket);
  
  logger.log('info', `New client connected! Name: ${currentClient.name}, id: ${currentClient.id}`);
  socket.write(`\nWelcome to the ${chatRoomName} chat room!\n`);
  socket.write(`\nYour chat name is: ${currentClient.name}.\n\n`);

  socket.on('data', data => {
    data = data.toString().trim();
    logger.log('info', `${currentClient.name} typed: ${data}`);

    currentClient.handleInput(data);
  });

  let removeClient = currentClient.removeClient.bind(currentClient);
  socket.on('error', removeClient);
  socket.on('close', removeClient);
});

const server = module.exports = {};

server.start = (port, callback) => {
  logger.log('info', `Server is running on port ${port}.`);
  console.log(`\nServer is running on port ${port}.\n`);
  return app.listen(port, callback);
};

server.stop = callback => {
  logger.log('info', '\nServer shutting down.\n');
  return app.close(callback);
};