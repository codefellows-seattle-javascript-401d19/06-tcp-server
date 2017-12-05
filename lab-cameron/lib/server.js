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

const parseCommand = (userInput, socket) => {
  if (userInput.startsWith('@')) {
    const parsedCommand = userInput.split(' ');
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
  socket.write('You have left the chatroom');
  socket.end();
  
  const userInput = {
    type: 'exit',
    input: `${socket.name} has left the chatroom`,
  };

  broadcast(socket, userInput);
  logger.log('info', `${socket.name} has left the chatroom`);
};

const broadcast = (socket, message) => {
  for (let client of clients) {
    if (client !== socket) {
      client.write(`${socket.name}: ${message}\n`);
    }
  }
};

app.on('connection', socket => {
  socket.name = faker.internet.userName();
  clients.push(socket);
  logger.log('info', 'Net socket');
  socket.write('Welcome to 401d19 chatroom\n');
  socket.write(`Your name is ${socket.name}\n`);

  socket.on('data', data => {
    logger.log('info', `Processing data: ${data}`);
    const userInput = {
      type: 'message',
      input: data.toString().trim(),
    };

    if (parseCommand(userInput, socket)) {
      return;
    }

    broadcast(socket, userInput);
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
