'use strict';

const server = module.exports = {};

const net = require('net');
const faker = require('faker');
const uuidv1 = require('uuid/v1');

const {
  logger,
  removeClient,
  parseCommand,
  broadcast,
} = require('./server-helpers');

logger.log('info', 'Hello world!');

const app = net.createServer();
let clients = [];

app.on('connection', socket => {
  socket.name = faker.internet.userName();
  socket.id = uuidv1();

  clients.push(socket);
  logger.log('info', 'Net socket');
  logger.log('info', `${socket.name} has connected under id ${socket.id}`);

  socket.write('Welcome to 401d19 chatroom\n');
  socket.write(`Your name is ${socket.name}\n`);

  const message = {
    type: 'enter',
    input: `${socket.name} has entered the chatroom`,
  };

  broadcast(socket, message, clients);

  socket.on('data', data => {
    logger.log('info', `Processing data: ${data}`);

    const message = {
      type: 'userInput',
      input: data.toString().trim(),
    };

    if (parseCommand(socket, message, clients)) {
      return;
    }

    broadcast(socket, message, clients);
  });


  socket.on('error', removeClient(socket, clients));
  socket.on('close', removeClient(socket, clients));
});

server.updateClients = updatedClients => {
  clients = updatedClients;
};

server.start = (port, callback) => {
  logger.log('info',`Server is up on port ${port}`);
  console.log('info',`Server is up on port ${port}`);
  return app.listen(port, callback);
};

server.stop = callback => {
  logger.log('info',`Server is off`);
  return app.close(callback);
};
