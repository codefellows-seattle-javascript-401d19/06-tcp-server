'use strict';

const net = require('net');
const faker = require('faker');
const winston = require('winston');

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({
      filename: 'log.json' }),

  ],
});
// winston.log('debug', 'debugger');
logger.log('info', 'hello world');
//-------------------------------------------------------
const app = net.createServer();
let clients =[];
//-----------------------------------------------
let parseCommand = (message, socket) => {
  if(message.startsWith('@')){
    let parsedCommand = message.split(' ');
    let commandWord = parsedCommand[0];
    let inputWord = parsedCommand[1];
    let inputMessage = parsedCommand.slice(2, parsedCommand.length).join(' ');

    switch(commandWord){
    case'@list': //like if(commandword === '@list'){}
      socket.write(clients.map(client => client.name).join('\n') + '\n');
      break;
    case'@quit': //doesnt close telnet
      clients = clients.filter((client) => {
        return client !== socket;
      });
      socket.write('see ya later alligator\n');
      break;
    case'@nickname':
      clients.map(client => {
        if(client === socket){
          client.name = inputWord;
        }
        socket.write(`your nickname is now ${inputWord}`);
      } );
      break;
    case'@dm':
      for( let client of clients){
        if(client.name === inputWord){
          client.write(`${socket.name}: ${inputMessage}\n`);
        }
      }
      break;
    default:
      socket.write(socket);

      socket.write('valid commands: @list');//add the other commands
    }
  }
};
//---------------------------------------------------------
app.on('connection', (socket) => {
  socket.name = faker.internet.userName();
  clients.push(socket);
  socket.write('welcome to 401d19 chatroom\n');
  socket.write(`Your name is ${socket.name}\n`);

  socket.on('data', (data) => {
    logger.log('info', `Processing data :${data}`);
    let message = data.toString().trim();
    if(parseCommand(message, socket))
      return;

    if(message.startsWith('@')){
      return;
    }
    for( let client of clients){
      if(client !== socket){
        client.write(`${socket.name}: ${message}\n`);
      }
    }
  });
  let removeClient = (socket) => () => {
    logger.log('info', `Removing ${socket.name}`);
    clients = clients.filter((client) => {
      return client !== socket;
    });
  };
  socket.on('error', removeClient(socket));
  socket.on('close', removeClient(socket));
});

const server  = module.exports = {};

server.start = (port, callback) => {
  logger.log('info', `server is up`);
  console.log('info', `server is up`);
  callback(null, port);
  return app.listen(port, callback);
};

server.stop = (port, callback) => {
  logger.log('info', `server is off`);

};
