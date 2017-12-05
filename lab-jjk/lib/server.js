'use strict';

const net = require('net');
const winston = require('winston');
const faker = require('faker');

let logger = new (winston.Logger)({
  transports: [
    new (winston.transports.File)({ filename: 'log.json' }),
  ],
});

logger.log('info','Hello world!');

const app = net.createServer();
let clients = [];

let parseCommand = (message,socket) =>{
  if(message.startsWith('@')){
    let parsedCommand = message.split(' ');
    let commandWord = parsedCommand[0];
    let dmMessage = parsedCommand.slice(2).join(' ').trim();
    switch(commandWord){
    case'@list':// vinicio - if(commandWord === '@list')
      socket.write(clients.map(client => client.name).join('\n') + '\n');
      break;

    case'@quit':
      socket.end('Thanks for visiting.  You are logged out.  Goodbye!\n'); //exits the chatroom
      break;

    case'@nickname':{
      let names = clients.map(client => client.name);

      if(!parsedCommand[1]) socket.write('You must supply a new nickname following the @nickname command.'); //if the user writes @nickname without anything after
      if(names.includes(parsedCommand[1])) socket.write(`${parsedCommand[1]} is already taken.  Try a different name.\n`); //if the user supplies a name that's already taken.

      for(let client of clients){
        if(client !== socket)
          client.write(`ALERT: <${socket.name}> has changed their name to <${parsedCommand[1]}>\n`); // name change announced to other users.
      }
      socket.name = parsedCommand[1]; // name changed.
      socket.write(`Your new nickname is ${socket.name}\n`); // user told that name change was successful.
      break;
    }
    case'@dm':{
      let names = clients.map(client => client.name);
      if(!names.includes(parsedCommand[1])) return socket.write(`${parsedCommand[1]} is not a valid user name.`); // if user tries to dm a name that doesn't exist.
      if(!dmMessage) socket.write('You must supply a message to send.\n'); // if user doesn't supply a message.
      for(let client of clients){
        if(client.name === parsedCommand[1])
          client.write(`DM from ${socket.name}: ${dmMessage}\n`);
      }
      socket.write(`Message sent to ${parsedCommand[1]}.\n`);
      break;
    }
    default:
      socket.write('Valid commands:\n @list: Lists all current usernames\n@quit: exits the chatroom\n @nickname <new-name>: Changes your nickname to <new-name>.  Must be one word.\n @dm <other-username> <message> : Sends a direct message to <other-user>.\n');
      break;
    }
    return true;
  }
  return false;
};

app.on('connection', (socket) => {
  socket.name = faker.internet.userName();
  clients.push(socket);
  logger.log('info', `New socket`);// [object object]
  socket.write('Welcome to 401d19 chatroom\n');
  socket.write(`Your name is ${socket.name}\n`);


  socket.on('data',(data) => {
    logger.log('info', `Processing data: ${data}`);
    let message = data.toString().trim();

    if(parseCommand(message,socket))
      return;

    for(let client of clients){
      //vinicio - instead of doing clients[client] I can use directly client
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
