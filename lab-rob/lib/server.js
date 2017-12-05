'use strict';

const net = require('net');
const winston = require('winston');
const faker = require('faker');
const app = net.createServer();

let clients = [];

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
  new Client(socket);
});


