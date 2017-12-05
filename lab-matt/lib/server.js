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
let clientPool = [];

// ============= PARSE MESSAGE ========================

let parseCommand = (message, socket) => {
  if (message.startsWith('@')) {
    let parseCommand = message.split(' ');
    let commandWord = parseCommand[0];
    let commandInput = parseCommand[1];

    switch (commandWord) {

      // mattL - command is '@list'
      case '@list':
        socket.write(clientPool.map(client => client.name).join('\n') + '\n');
      break;

      // mattL - command is '@nickname <newName>'
      case '@nickname':
        if (commandInput) {
          let nameExists = clientPool.some((each) => {
            return (each.name.toLowerCase() === commandInput.toLowerCase());
          });

          if (nameExists) {
            return socket.write(`name: ${commandInput} has already been taken\n`);
          } else {
            socket.name = commandInput;
            return socket.write(`your name has been changed to: '${socket.name}'\n`);
          }
        } else {
          socket.write(`no input for username, syntax: '@username <your username> | yourUsername: ${socket.name}'\n`);
        }
      break;

      // mattL - command is '@quit'      
      case '@quit':
        clientPool = clientPool.filter((client) => {
          if (client !== socket)
            return client;
        });
        socket.destroy();
      break;

      // mattL - command is '@dm <user> <message>'      
      case '@dm':
        //mattL - magical regex (returns anything past '@dm <anythingButWhiteSpace> ')
        let directMessage = message.match(/^@dm \S+ (.+)/)[1];
      
        for(let client of clientPool) {
          if (client.name === commandInput) {
            client.write(`${socket.name}: ${directMessage}\n`);
          }
        }
      break;

      // mattL - default if no matching @commands
      default:
        socket.write('valid commands: @list | @dm | @nickname |  @quit \n');
      break;
    }
    // mattL - return true if the original message started with '@' 
    return true;
  }
  // mattL - return false if the orginal message did not start with '@'
  return false;
};

// ============== CONNECTION HANDLING ====================

app.on('connection', (socket) => {
  let id = 0;
  socket.name = faker.internet.userName();
  socket.id = id;
  clientPool.push(socket);
  id += 1;

  logger.log('info', `New Socket | Name: ${socket.name}`);
  socket.write('Welcome to 401d19 chatroom\n');
  socket.write(`Your name is ${socket.name}\n`);
  
  socket.on('data', (data) => {
    logger.log('info', `Processing data: ${data}`);
    
    let message = data.toString().trim();
    
    if (parseCommand(message, socket))
      return;
    
    for(let client of clientPool) {
      if (client !== socket) {
        client.write(`${socket.name}: ${message}\n`);
      }
    }
  });

  let removeClient = (socket) => () => { 
    clientPool = clientPool.filter((client) => {
      return client !== socket;
    }); 

    logger.log('info', `removing ${socket.name}`);
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
  logger.log('info', `Server is stopping`);
  return app.close(callback);
};