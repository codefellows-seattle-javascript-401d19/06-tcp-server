'use strict';

const winston = require('winston');

const server = require('./server');

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.File)({ filename: 'log.json'}),
  ],
});

const parseCommand = (socket, message, clients) => {
  if (message.input.startsWith('@')) {
    const parsedCommand = message.input.split(' ');
    const commandWord = parsedCommand[0];
    const nickname = parsedCommand[1];
    const recipient = parsedCommand[1];
    const dmessage = parsedCommand.slice(2, parsedCommand.length).join(' ');

    switch (commandWord) {
    case '@list':
      socket.write(clients.map(client => client.name).join('\n') + '\n');
      break;
    case '@quit':
      quitChatroom(socket, clients);
      break;
    case '@nickname':
      changeNickname(socket, clients, nickname);
      break;
    case '@dm':
      directMessage(socket, clients, recipient, dmessage);
      break;
    default:
      socket.write('Valid commands: @list\n');
      break;
    }
    return true;
  }
  return false;
};

const removeClient = (socket, clients) => () => {
  logger.log('info',`Removing ${socket.name}`);

  clients = clients.filter(client => {
    return client !== socket;
  });

  server.updateClients(clients);
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

  for (let client of clients) {
    console.log(`client: ${client}, nickname: ${nickname}`);
    if (client.name === nickname) {
      socket.write(`The nickname ${nickname} has already been taken. Please try another one you like\n`);
      return;
    }
  }

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

const directMessage = (socket, clients, recipient, dmessage) => {
  logger.log('info', `${socket.name} has dm'd ${recipient}\n`);

  for (let client of clients) {
    if (client.name === recipient) {
      client.write(`${socket.name}: ${dmessage}\n`);
      return;
    }
    console.log(`client: ${client.name}, ${recipient}`);
  }

  socket.write(`${recipient} is not currently online\n`);
};

module.exports = {
  logger,
  removeClient,
  parseCommand,
  broadcast,
};
