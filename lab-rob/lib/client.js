'use strict';

const faker = require('faker');

class Client {
  constructor(socket) {
    this.socket = socket;
    this.id = faker.random.uuid();

    do {
      this.name = faker.internet.userName();
    } while (!nameIsUnique(this.name));

    Client.clients.push(this);
  }

  changeName(newName) {
    if (nameIsUnique(newName)) {
      this.name = newName;
      return true;
    } else
      return false;
  }

  otherClients() {
    return Client.clients.filter(client => client.name !== this.name);
  }

  parseCommand(command) {
    let parsedCommand = command.split(' ');
    let commandWord = parsedCommand[0];
    switch (commandWord) {
    case '@list':
      if (this.otherClients().length > 0)
        this.socket.write('\n' + this.otherClients().map(client => client.name).join('\n') + '\n');
      else
        this.socket.write('\nYou are the only person in the chat room.\n\n');
      break;
    default:
      this.socket.write(`\nValid commands: @list\n\n`);
    }
  }

  removeClient() {
    this.otherClients()
      .forEach(client => client.socket.write(`\n${this.name} has left the chat room.\n\n`));
    Client.clients = Client.clients.filter(client => {
      return client.socket !== this.socket;
    });
  }

}

Client.clients = [];

function nameIsUnique(name) {
  return !Client.clients.map(client => client.name).includes(name);
}

module.exports = Client;