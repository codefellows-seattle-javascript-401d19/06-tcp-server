'use strict';

const net = require('net');
const winston = require('winston');
const faker = require('faker');

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.File)({ filename: 'log.json'}),
  ],
});

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
      quitChatroom(socket);
      break;
    default:
      socket.write('Valid commands: @list\n');
      break;
    }
    return true;
  }
  return false;
};

const removeClient = socket => () => {
  clients = clients.filter(client => {
    return client !== socket;
  });
  logger.log('info',`Removing ${socket.name}`);
};

const quitChatroom = socket => {
  socket.write('You have left the chatroom\n');
  socket.end();

  const message = {
    type: 'exit',
    input: `${socket.name} has left the chatroom`,
  };

  broadcast(socket, message);
  logger.log('info', `${socket.name} has left the chatroom`);
};

const broadcast = (socket, message) => {
  for (let client of clients) {
    if (client !== socket) {
      switch (message.type) {
      case 'enter':
        client.write(`${message.input}\n`);
        break;
      case 'exit':
        client.write(`${message.input}\n`);
        break;
      case 'chat':
        client.write(`${socket.name}: ${message.input}\n`);
        break;
      default:
        break;
      }
    }
  }
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

  broadcast(socket, message);

  socket.on('data', data => {
    logger.log('info', `Processing data: ${data}`);

    const message = {
      type: 'chat',
      input: data.toString().trim(),
    };

    if (parseCommand(socket, message)) {
      return;
    }

    broadcast(socket, message);
  });


  socket.on('error', removeClient(socket));
  socket.on('close', removeClient(socket));
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
