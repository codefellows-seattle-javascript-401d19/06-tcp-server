'use strict';

const net = require('net');
const winston = require('winston');
const faker = require('faker');
//----------------------------------------------
var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.File)({ filename: 'log.json' }),
  ],
});

logger.log('info', 'Hello, world.');
//----------------------------------------------
const app = net.createServer();
let clients = [];
//----------------------------------------------

let parseCommand = (message, socket) => {
  if (message.startsWith('@')) {
    let parsedCommand = message.split(' ');
    let commandWord = parsedCommand[0];
    let dmMessage = parsedCommand.slice(2).join(' ').trim();
    
    switch(commandWord) {
    case '@list': //basically an if(commandWord === '@list')
      socket.write(clients.map(client => client.name).join('\n') + '\n');
      break;
    case '@quit':
      socket.end('Your session has ended.\n');
      break;
    case '@nickname':
      if (clients.indexOf(parseCommand[1]) === -1)
        socket.write(`Your new nickname is ${parsedCommand[1]}\n`);
      socket.name = parsedCommand[1];
      logger.log(socket.name);
      break;
    case '@dm':
      for (let client of clients) {
        if (!client.name.hasOwnProperty(parsedCommand[1]))
          socket.write('This name was not found. Please use @list command for valid nicknames.\n');
        break;
      }
      for (let client of clients) {
        if (client.name === parsedCommand[1])
          client.write(`DM from ${socket.name}: ${dmMessage}\n`);
        console.log(clients);
      }
      socket.write(`DM sent to ${parsedCommand[1]}\n`);
      logger.log(dmMessage);
      break;
    default:
      socket.write('Valid commands: @list, @quit, @nickname, @dm');
      break;
    }
    return true;
  }
  return false;
};

app.on('connection', (socket) => { 
  socket.name = faker.internet.userName();
  socket.id = faker.random.uuid();
  clients.push(socket);
  logger.log('info', `New socket at ${socket.id}`);
  socket.write('Welcome to 401d19 chatroom\n');
  socket.write(`Your name is ${socket.name}\n`);

  socket.on('data', (data) => {
    logger.log('info', `Processing data: ${data}`);
    let message = data.toString().trim();

    if (parseCommand(message,socket))
      return;

    for (let client of clients) {
      //instead of referencing client[client], you can reference client itself
      if (client !== socket) 
        client.write(`${socket.name}: ${message}\n`);
    }
  });
  let removeClient = (socket) => () => {
    clients = clients.filter( (client) => {
      return client !== socket;
    });
    logger.log('info', `Removing ${socket.name}`);
  };
  socket.on('error', removeClient(socket));
  socket.on('close', removeClient(socket));
});
//----------------------------------------------
const server = module.exports = {};

server.start = (port, callback) => {
//   logger.log('info', 'Server is up on port ${port}');
  console.log('info', `Server is up on port ${port}`);
  return app.listen(port, callback);
};

server.stop = (callback) => {
  logger.log('info', 'Server is off.');
  return app.close(callback);
};
