'use strict';

const net = require('net');
const faker = require('faker');
const winston = require('winston');

let logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({ filename: 'log.json'}),
  ],
});


winston.level = 'debug';
logger.log('info', 'hello world');

const app = net.createServer();
let clients = [];

// ============= PARSE MESSAGE ========================

let parseCommand = (message, socket) => {
  if (message.startsWith('@')) {
    let parseCommand = message.split(' ');
    let commandWord = parseCommand[0];
    let commandPrompt = parseCommand[1];

    switch (commandWord) {
      case '@list':
        socket.write(clients.map(client => client.name).join('\n') + '\n');
      break;

      case '@quit':
        clients = clients.filter((client) => {
          if (client !== socket)
            return client;
        });
        socket.destroy();
      break;

      case '@nickname':
        if (commandPrompt) {
          let nameExists = clients.some((each) => {
            return (each.name === commandPrompt);
          })

          if (nameExists) {
            return socket.write(`name: ${commandPrompt} has already been taken\n`);
          } else {
            socket.name = commandPrompt;
            return socket.write(`your name has been changed to: '${socket.name}'\n`);
          }
        } else {
          socket.write(`no input for username, syntax: '@username <your username>'\n`);
        }
      break;

      default:
        socket.write('valid commands: @list | @quit | @nickname\n');
      break;
    }
    return true;
  }
  return false;
}

// ============== CONNECTION HANDLING ====================

app.on('connection', (socket) => {
  socket.name = faker.internet.userName();
  clients.push(socket);

  logger.log('info', `New Socket | Name: ${socket.name}`);
  socket.write('Welcome to 401d19 chatroom\n');
  socket.write(`Your name is ${socket.name}\n`);
  
  socket.on('data', (data) => {
    logger.log('info', `Processing data: ${data}`);
    
    let message = data.toString().trim();
    
    if (parseCommand(message, socket))
      return;
    
    for(let client of clients) {
      if (client !== socket) {
        client.write(`${socket.name}: ${message}\n`);
      }
    }
  });

  let removeClient = (socket) => () => { 
    clients = clients.filter((client) => {
      return client !== socket;
    }); 

    logger.log('info', 'removing ${socket.name}');
  };
  
  socket.on('error', () => {
    removeClient(socket);
  });

  socket.on('close', () => {
    removeClient(socket);    
  });
});

// ============ SERVER EXPORTS =====================

const server = module.exports = {};

server.start = (port, callback) => {
  logger.log('info', `Server is up on port ${port}`);
  console.log('info', `Server is up on port ${port}`);
  return app.listen(port, callback);
};

server.stop = (callback) => {
  logger.log('info', `Server is up off`);
  return app.close(callback);

};