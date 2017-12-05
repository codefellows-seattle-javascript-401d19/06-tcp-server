'use strict';

const net = require('net');
const faker = require('faker');

const { logger, removeClient, broadcast, quitChatroom } = require('./server-helpers');

logger.log('info', 'Hello world!');

const app = net.createServer();
let clients = [];

const parseCommand = (socket, message) => {
  if (message.input.startsWith('@')) {
    const parsedCommand = message.input.split(' ');
    const commandWord = parsedCommand[0];

    switch (commandWord) {
    case '@list':
      socket.write(clients.map(client => client.name).join('\n') + '\n');
      break;
    case '@quit':
      quitChatroom(socket, clients);
      break;
    case '@nickname':
      break;
    default:
      socket.write('Valid commands: @list\n');
      break;
    }
    return true;
  }
  return false;
};


app.on('connection', socket => {
  socket.name = faker.internet.userName();
  clients.push(socket);
  logger.log('info', 'Net socket');

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

    if (parseCommand(socket, message)) {
      return;
    }

    broadcast(socket, message, clients);
  });


  socket.on('error', removeClient(socket, clients));
  socket.on('close', removeClient(socket, clients));
});

const server = module.exports = {};

server.start = (port, callback) => {
  logger.log('info',`Server is up on port ${port}`);
  console.log('info',`Server is up on port ${port}`);
  return app.listen(port, callback);
};

server.stop = callback => {
  logger.log('info',`Server is off`);
  return app.close(callback);
};
