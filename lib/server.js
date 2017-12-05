'use strict';

const net = require('net');
const winston = require('winston');
const faker = require('faker');
const server = module.exports = {};

// ------------------------------------------------------
let logger = new (winston.Logger)({
  transports: [
    new (winston.transports.File)({ filename: 'log.json' }),
  ],
});

logger.log('info','Hello world!');
// winston.level = 'debug';
// winston.log('debug','Hello world!');
// ------------------------------------------------------

const app = net.createServer();
let clients = [];
// ------------------------------------------------------

let parseCommand = (message,socket) =>{
  if(message.startsWith('@')){
    let parsedCommand = message.split(' ');
    let commandWord = parsedCommand[0];

    switch(commandWord){
    case '@list':// vinicio - if(commandWord === '@list')
      socket.write(clients.map(client => client.name).join('\n') + '\n');
      break;
    // case `@quit`:
      // socket.write(`\n`)
      // //if the client enters the 'quit' command, disconnect them from the server
      // break;

    case `@nickname`:
      if (!parsedCommand[1]){
        logger.log(`info`, `${parsedCommand}`);
        socket.write(`Please provide a nickname with the command` + `\n`);
        return;
      }

      let newName = parsedCommand[1];
      socket.name = newName
      socket.write(`Your new name is ${newName}` + `\n`);
      logger.log(`info`, `New name is ${socket.name}`);
      break;

    // case `@dm`:
    //   socket.write(`\n`);
    //     //if the client enters '@dm', send their message (3rd argument) to the specified user (2nd argument)
    //   break;

    default:
      socket.write('Valid commands: @list\n');
      break;
    }
    return true;
  }
  return false;
};

app.on('connection', (socket) => {  //socket is the client connection to the server
  socket.name = faker.internet.userName();
  clients.push(socket);
  logger.log('info', `New socket`);
  socket.write(`Welcome to 401d19 chatroom!\n`);
  socket.write(`Your name is ${socket.name}\n`);


  socket.on('data',(data) => {  //I can't find this in the docs; is data a built in function like "connection" or "write"?
    logger.log('info', `Processing data: ${data}`);
    let message = data.toString().trim();

    if(parseCommand(message,socket))
      return;

    for(let client of clients){
      if(client !== socket)
        client.write(`${socket.name}: ${message}\n`);
    }
  });

  let removeClient = (socket) => () => {
    clients = clients.filter((client) => {
      return client !== socket;
    });
    logger.log('info',`Removing ${socket.name}`);
  };
  socket.on('error', removeClient(socket));
  socket.on('close', removeClient(socket));
});

server.start = (port, callback) => {
  logger.log('info',`Server is up on port ${port}`);
  console.log('info',`Server is up on port ${port}`);
  return app.listen(port,callback);
};

server.stop = (callback) => {
  logger.log('info',`Server is off`);
  return app.close(callback);
};
