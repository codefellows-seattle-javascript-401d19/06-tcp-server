'use strict';

const net = require('net');
const winston = require('winston');
const faker = require('faker');
const app = net.createServer();

let clients = [];
const chatRoomName = faker.company.catchPhrase();

class Client {
  constructor(socket) {
    this.socket = socket;
    this.id = faker.random.uuid();
    
    do {
      this.name = faker.internet.userName();
    } while (!nameIsUnique(this.name));

    clients.push(this);
  }

  changeName(newName) {
    if(nameIsUnique(newName)) {
      this.name = newName;
      return true;
    } else
      return false;
  }

}

let nameIsUnique = name => {
  return !clients.map(client => client.name)
    .includes(name);
};

let logger = new (winston.Logger)({
  transports: [
    new (winston.transports.File)({filename: 'log.json'}),
  ],
});

app.on('connection', socket => {
  let currentClient = new Client(socket);
  logger.log('info', `New client connected! Name: ${currentClient.name}, id: ${currentClient.id}`);
  socket.write(`Welcome to the ${chatRoomName} chat room!\n`);

  socket.on('data', data => {
    logger.log('info', `${currentClient.name} typed: ${data}`);
    for(let client of clients) {
      if(client.socket !== socket)
        client.socket.write(`${client.name}: ${data}`);
    }
    // put other client logic here, parsedCommands?
  });

  let removeClient = socket => () => {
    clients = clients.filter(client => {
      return client.socket !== socket;
    });
  };

  socket.on('error', removeClient(socket));
  socket.on('close', removeClient(socket));
});

const server = module.exports = {};
server.start = (port, callback) => {
  logger.log('info', `Server is running on port ${port}.`);
  console.log(`Server is running on port ${port}.`);
  return app.listen(port, callback);
};

server.stop = callback => {
  logger.log('info', 'Server shutting down.');
  return app.close(callback);
};