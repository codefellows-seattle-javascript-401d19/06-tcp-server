'use strict';

const net = require('net');
const winston = require('winston');
const faker = require('faker');
// ------------------------------------------------------
let logger = new (winston.Logger)({
  transports: [
    new (winston.transports.File)({ filename: 'log.json' }),
  ],
});

const app = net.createServer();
let clients = [];

let parseCommand = (message,socket) =>{

  if(message.startsWith('@')) {
    let parsedCommand = message.split(' ');
    let commandWord = parsedCommand[0];
    let dmMessage = parsedCommand[2];

    switch(commandWord){

    case'@list': // vinicio - if(commandWord === '@list')
      socket.write(clients.map(client => client.name).join('\n') + '\n');
      break;

    case'@quit':
      socket.write(`Goodbye, ${socket.name} `);
      socket.destroy();
      break;

    case'@name':
      if(!parsedCommand[1]) {
        socket.write('Please enter your new user name after command @name\n');
        return;
      }
      let newName = parsedCommand[1];
      socket.name = newName;
      socket.write(`Your new name is ${socket.name}\n`);
      break;

    case'@dm':

      let dmMessageParsed = parsedCommand.slice(2).join(' ');
      let names = clients.map(client => client.name);

      if(!names.includes(parsedCommand[1]))
        socket.write(`${parsedCommand[1]} is not one of the chat members, please pick another member.`);

      if(!dmMessage)
        socket.write(`${name}, you have to type your message after typing chat member's name`);

      for(let client of clients) {
        if(client.name === parsedCommand[1])
          client.write(`DM from ${socket.name}: ${dmMessageParsed}\n`);
      };
      socket.write(`Message sent to ${parsedCommand[1]}`);
      break;

    default:
      socket.write(`Valid commands: @list, @quit, @name <new-username>, @dm<to-user-name> <message>\n`);
      break;
    }
    return true;
  }
  return false;
};

app.on('connection', (socket) => {
  socket.name = faker.internet.userName();
  clients.push(socket);
  socket.write('Welcome to 401d19 chatroom\n');
  socket.write(`Your name is ${socket.name}\n`);


  socket.on('data',(data) => {
    logger.log('info', `Processing data: ${data}`);
    let message = data.toString().trim();

    if(parseCommand(message,socket))
      return;

    for(let client of clients){
      //vinicio - instead of doing clients[client] I can use directly client
      if(client.socket !== socket)
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

const server = module.exports = {};

server.start = (port, callback) => {
  logger.log('info',`Server is up on port ${port}`);
  console.log('info',`Server is up on port ${port}`);
  return app.listen(port,callback);
};

server.stop = (callback) => {
  logger.log('info',`Server is off`);
  return app.close(callback);
};
