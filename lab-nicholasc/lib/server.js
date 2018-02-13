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
logger.log('info', 'hello world');
//-------------------------------------------------------
const app = net.createServer();
let clients ={
  home: [],
};
//-----------------------------------------------
let parseCommand = (message, socket) => {
  if(message.startsWith('@')){
    let input = message.split(' ');
    let command = input[0];
    let descriptor = input[1];
    let inputMessage = input.slice(2, input.length).join(' ');

    switch(command){
    case'@list':
      socket.write(clients[socket.currentServer].map(client => client.name).join('\n') + '\n');
      break;
    case'@admin':

      break;
    case'@join':
      if(clients[descriptor]){
        clients[socket.currentServer] = clients[socket.currentServer].filter((client) => {
          return client !== socket;
        });
        for( let client of clients[socket.currentServer]){
          client.write(`${socket.name}: has left ${socket.currentServer}\n`);
        }
        clients[descriptor].push(socket);
        socket.currentServer = descriptor;
        for( let client of clients[socket.currentServer]){
          if(client !== socket) client.write(`${socket.name}: has joined ${socket.currentServer}\n`);
        }
        socket.write(`you have joined ${socket.currentServer} \n`);
        break;

      } else {
        clients[descriptor] = [];
        clients[socket.currentServer] = clients[socket.currentServer].filter((client) => {
          return client !== socket;
        });
        clients[descriptor].push(socket);
        socket.currentServer = descriptor;
        socket.write(`the server "${descriptor} has been created and joined \n`);
        break;
      }
    case'@quit':
      clients[socket.currentServer] = clients[socket.currentServer].filter((client) => {
        return client !== socket;
      });
      socket.end('see ya later alligator\n');
      break;
    case'@nickname':
      clients[socket.currentServer].map(client => {
        if(client === socket){
          client.name = descriptor;
        }
        socket.write(`your nickname is now ${descriptor} \n`);
      } );
      break;
    case'@dm':
      for( let client of clients[socket.currentServer]){
        if(client.name === descriptor){
          client.write(`${socket.name}: ${inputMessage}\n`);
        }
      }
      break;
    default:
      socket.write(socket);

      socket.write('valid commands: @list, @dm, @nickname, @quit, @join');
    }
  }
};
//---------------------------------------------------------
app.on('connection', (socket) => {
  socket.currentServer = 'home';

  socket.name = faker.internet.userName();
  clients.home.push(socket);
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

    for( let client of clients[socket.currentServer]){
      if(client !== socket){
        client.write(`${socket.name}: ${message}\n`);
      }
    }
  });
  let removeClient = (socket) => () => {
    logger.log('info', `Removing ${socket.name}`);

    clients[socket.currentServer] = clients[socket.currentServer].filter((client) => {
      return client !== socket;
    });
  };
  socket.on('error', removeClient(socket));
  socket.on('close', removeClient(socket));
});

const server  = module.exports = {};

server.start = (port, callback) => {
  if(typeof port !== 'number')
    return callback('port must be a number', port);
  logger.log('info', `server is up`);
  console.log('info', `server is up`);
  callback(null, port);
  return app.listen(port, callback);
};

server.stop = (port, callback) => {
  logger.log('info', `server is off`);

};
