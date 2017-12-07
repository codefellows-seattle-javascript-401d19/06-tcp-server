# TCP Chat Server

This TCP Chat Server allows users to connect to an ip via telnet and do basic chat with one another, change their displayd name, and direct message other users.

## Motivation

FUN! and Classwork :)

## Build status

<!-- Build status of continus integration i.e. travis, appveyor etc. Ex.  -->
Status: Working


## Code style

js-standard-style

## Screenshots

![Chat Room Example](https://raw.githubusercontent.com/SethDonohue/06-tcp-server/seth-lab/lab-seth/img/TCP-Chat-Server.png)

## Tech/framework used
- Eslint
- Node
- Winston
- Faker
- Javascript /ES6
- telnet


#### Built with

VScode

## Features

TCP Chat Server is super easy to use and has just a few commands to keep it simple. It uses Winston Logger to keep track of logs.

## Code Example
```
 switch(commandWord){
    case'@list':// seth - if(commandWord === '@list')
      socket.write(clients.map(client => client.name).join('\n') + '\n');
      break;
    case'@quit':// seth - if(commandWord === '@quit')
      socket.end();//(clients.map(client => client.name).join('\n') + '\n');
      break;
    case'@nickname':// seth - if(commandWord === '@nickname')
      // if(!commandArgument1){
      //   socket.write('You must enter something after @nickname \n');
      // }else{
      socket.write(`Your new name is: ${commandArgument1} \n`);
      for (let client of clients) { //vinicio - instead of doing clients[client] I can use directly client
        if (client !== socket)
          client.write(`${socket.name} has changed their name to ${commandArgument1} \n`);
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
```

## Installation
- get source code from github (https://github.com/SethDonohue/06-tcp-server/tree/seth-lab/lab-seth)
- npm install
- npm install -s winston
- npm install -faker

1. start server with command: node index.js
2. connect to server from another terminal using server host ip and port: telnet 127.0.0.1 3000
3. type away to send messages to the chatroom
4. type @command to see list of commands.

<!-- Provide step by step series of examples and explanations about how to get a development env running. -->

## API Reference

Docs in Progress

## Tests

No test at this time

## How to use?

In Chat Commands:
- @: shows list of commands
- @list: list users
- @quit: quits chatroom and closes telnet connection
- @nickname <new-name>: changes your displayed name
- @dm <to-name> <message>: allows user to direct message another user
<!-- If people like your project they’ll want to learn how they can use it. To do so include step by step guide to use your project. -->

## Contribute

<!-- Let people know how they can contribute into your project. A contributing guideline will be a big plus. -->

## Credits

- Winston
- Node
- Classmates that helped me!
<!-- Give proper credits. This could be a link to any repo which inspired you to build this project, any blogposts or links to people who contrbuted in this project.

Anything else that seems useful -->

## License

#### MIT © Seth Donohue