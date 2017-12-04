'use strict';


const net = require('net');
const winston = require('winston');
const faker = require('faker');

let logger = new (winston.logger)({
    transports: [
        new (winston.transports.File)({filename: 'log.json'}),
    ],
})

logger.log('info', 'Hello World!');

const app = net.createServer();
let clients = [];

let parseCommand = (message, socket) => { //need to add more cases for more commands/messages
    if(message.startsWith('@')){
        let parsedCommand = message.split(' ');
        let commandWord = parsedCommand[0];
        switch(commandWord){ // a way to have a series of if's in a row, and is faster internally in JS that a bunch of if's in a row. less contorl than if's though
        case'@list':
            socket.write(clients.map(client => client.name).join('\n') + '\n');
            break;
        default:
            socket.write('valid commands: @list \n')
            break;
        }
        return true;
    }
    return false;
}

app.on('connection', (socket) => {
    socket.name = faker.internet.userName();
    clients.push(socket);
    logger.log('info', 'New socket'); //[object object] ${JSON.stringify(socker, null, 2)}
    socket.write('Welcome to 401d19 Chatroom\n');
    socket.write(`Your name is ${socket.name}\n`);

    socket.on('data', (data) => {
        logger.log('info', 'Pocessing data: ${data}');
        let message = data.toString().trim();

        if(parseCommand(message, socket))
            return;

        for(let client of clients){ //client[client] is implicit, cna just use client
            if(client !== socket) //stops you from sending to yourself, the socket is the specific instance of the client
                client.write(`${socket.name}: ${message}`);
        }
    });
    let removeClient = (socket) => () => {
        logger.log('info', `Removing ${socket.name}`);
        clients = clients.filter((client) => {
            return client !== socket;
        });
    };
    socket.on('error', removeClient(socket));
    socket.on('close', removeClient(socket));
});

const server = module.exports = {};

 //everything above this is hidden from server
server.start = (port, clalback) => {
    logger.log('info', `Server is up on port ${port}`);
    console.log('info', `Server is up on port ${port}`);
    return app.listen(port, callback);
};

server.stop = (callback) => {
    logger.log('info', `Server is off.`);
    console.log('info', `Server is off.`)
    return app.close(callback);    

};
