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

logger.log('info','Hello world!');
// ------------------------------------------------------
const app = net.createServer();
let clients = [];
// ------------------------------------------------------

let parseCommand = (message, socket) =>{
  if(message.startsWith('@')){
    let parsedCommand = message.split(' ');//turns command typed into array
    let commandWord = parsedCommand[0];
    let commandArgument1 = parsedCommand[1];
    let commandArgument2 = parsedCommand.slice(2).join(' ').trim();

    switch(commandWord){
    case'@list':
      socket.write(clients.map(client => client.name).join('\n') + '\n');
      break;
    case'@quit':
      socket.end();
      break;
    case'@nickname':
      if(!commandArgument1){
        socket.write('You must enter something after @nickname \n');
      }else{
        socket.write(`Your new name is: ${commandArgument1} \n`);
        for (let client of clients) { //vinicio - instead of doing clients[client] I can use directly client
          if (client !== socket)
            client.write(`${socket.name} has changed their name to ${commandArgument1} \n`);
        }
      }
      socket.name = commandArgument1;
      break;
    case'@dm':// seth - if(commandWord === '@dm') // USE LOOP through clients THAT ONLY GOES TO DM USER
      if (!commandArgument1) {
        socket.write('You must enter a <name> after @dm \n');
      }else if(!commandArgument2) {
        socket.write('You must enter a <message> after @dm <username> \n');
      } else {
        for (let client of clients) {
          if (client.name === commandArgument1){
            console.log('hitting clinet loop');
            client.write(`Direct Message from ${socket.name}: ${commandArgument2}`); //}
          }
        }
      }
      break;
    default:
      socket.write('Valid commands: @list, @quit, @nickname <new-name>, @dm <to-username> <message> \n');
      break;
    }
    return true;
  }
  return false;
};

app.on('connection', (socket) => {
  socket.name = faker.internet.userName();
  socket.id = faker.random.uuid();

  console.log('new socket username: ', socket.name);
  console.log('new socket uuid: ', socket.id);


  clients.push(socket);
  logger.log('info', `Net socket`);// [object object]
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
  socket.on('close', removeClient(socket)); //only removes client/socket from clients array
  socket.on('error', removeClient(socket));
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