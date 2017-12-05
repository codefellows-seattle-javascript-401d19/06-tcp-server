'use strict';

const winston = require('winston');

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.File)({ filename: 'log.json'}),
  ],
});

const removeClient = (socket, clients) => () => {
  logger.log('info',`Removing ${socket.name}`);

  clients = clients.filter(client => {
    return client !== socket;
  });
};

const quitChatroom = (socket, clients) => {
  logger.log('info', `${socket.name} has left the chatroom`);

  socket.write('You have left the chatroom\n');
  socket.end();

  const message = {
    type: 'exit',
    input: `${socket.name} has left the chatroom`,
  };

  broadcast(socket, message, clients);
};

const broadcast = (socket, message, clients) => {
  for (let client of clients) {
    if (client !== socket) {
      switch (message.type) {
      case 'enter':
        client.write(`${message.input}\n`);
        break;
      case 'exit':
        client.write(`${message.input}\n`);
        break;
      case 'userInput':
        client.write(`${socket.name}: ${message.input}\n`);
        break;
      case 'nickname':
        client.write(`${message.input} Yes, this will be confusing\n`);
        break;
      default:
        break;
      }
    }
  }
};

const changeNickname = (socket, clients, nickname) => {
  logger.log('info', `${socket.name} is now ${nickname}`);

  socket.write(`Henceforth, you shall be known as ${nickname}\n`);

  const message = {
    type: 'nickname',
    input: `${socket.name} is now ${nickname}\n`,
  };

  for (let client of clients) {
    if (client === socket) {
      client = nickname;
      socket.name = nickname;
    }
  }

  broadcast(socket, message, clients);
};

module.exports = {
  removeClient,
  quitChatroom,
  broadcast,
  logger,
  changeNickname,
};
