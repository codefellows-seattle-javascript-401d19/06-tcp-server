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
    this.announcePresence();
  }

  announcePresence() {
    this.otherClients()
      .forEach(client => client.socket.write(`\n${this.name} has joined the chat room.\n\n`));
  }

  speak(message) {
    this.socket.write('\n');
    this.otherClients()
      .forEach(client => client.socket.write(`\n${this.name}: ${message}\n\n`));
  }

  handleInput(data) {
    if (data.startsWith('@'))
      this.parseCommand(data);
    else
      this.speak(data);
  }

  changeName(newName) {
    newName = newName.replace(/ /g, '');
    if (nameIsUnique(newName)) {
      this.name = newName;
      return true;
    } else
      return false;
  }

  sendDm(recipient, message) {
    for(let i = 0; i < Client.clients.length; i++) {
      let client = Client.clients[i];
      if(client.name === recipient) {
        client.socket.write(`\nDM from ${this.name}: ${message}\n\n`);
        return;
      }
    }
    this.socket.write(`\n${recipient} is not in this chat!\n\n`);
  }

  whoAmI() {
    this.socket.write(`\nYour name is ${this.name}\n\n`);
  }

  otherClients() {
    return Client.clients.filter(client => client.name !== this.name);
  }

  parseCommand(command) {
    let parsedCommand = command.split(' ');
    let commandWord = parsedCommand[0];
    let oldName = this.name;
    switch (commandWord) {
      case '@me':
        this.whoAmI();
        break;
      case '@list':
        this.list();
        break;
      case '@quit':
        this.socket.end('\nCome back soon!\n\n');
        break;
      case '@nickname':
        if(!this.changeName(parsedCommand.slice(1).join(' ')))
          this.socket.write(`\nSorry, but the name ${parsedCommand.slice(1).join(' ')} is already taken.\n\n`);
        else {
          this.otherClients().forEach(client => client.socket.write(`\n${oldName} has changed their name to ${this.name}.\n\n`));
          this.socket.write(`\nYour name has been changed to ${this.name}.\n\n`);
        }
        break;
      case '@dm':
        this.sendDm(parsedCommand[1], parsedCommand.slice(2).join(' '));
        break;
      default:
        this.socket.write(`\nValid commands: @me, @list, @nickname <new-name>, @dm <user-name> <message>, @quit\n\n`);
    }
  }

  list() {
    if (this.otherClients().length > 0)
      this.socket.write('\nCurrent Chatters:\n\n' + this.otherClients().map(client => client.name).join('\n') + '\n\n');
    else
      this.socket.write('\nYou are the only person in the chat room.\n\n');
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