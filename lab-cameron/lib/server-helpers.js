'use strict';

const winston = require('winston');

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.File)({ filename: 'log.json'}),
  ],
});

const removeClient = (socket, clients) => () => {
  clients = clients.filter(client => {
    return client !== socket;
  });
  logger.log('info',`Removing ${socket.name}`);
};

const quitChatroom = (socket, clients) => {
  socket.write('You have left the chatroom\n');
  socket.end();

  const message = {
    type: 'exit',
    input: `${socket.name} has left the chatroom`,
  };

  broadcast(socket, message, clients);
  logger.log('info', `${socket.name} has left the chatroom`);
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
      default:
        break;
      }
    }
  }
};

module.exports = { removeClient, quitChatroom, broadcast, logger };
