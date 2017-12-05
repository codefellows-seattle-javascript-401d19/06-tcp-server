# Code Fellows: Seattle 401 JavaScript - 401d19


##  Lab 06: TCP Chat Server

### Author:
 Catherine Looper

### Motivation

This project is a Transmisson Control Protocol (TCP) chatroom where clients can connect to a telnet client, update their user name, message all chat users, direct message a designated user, and exit the chatroom.

### Build

The only module that is being exported is the server module with start and stop properties - this is to keep the rest of the server.js code private. 

Inside server.js there is a Client class and constructor function that contains an id, name, and socket. The Client class is used to instantiate new users (once they have joined the chatroom).

The other functions include a parseCommand that handles messages based on whether a user is passing a command (such as @list) or whether they are simply sending a message to the chatroom. There is an app.on function that instantiates new users and handles when they exit the chat. Then there are the server.start and server.stop functions that are being exported and handle the server connection.

### Limitations

In order to join the existing chatroom - you must request the IP address and port of the host and manually connect. 

### Code Style

Standard JavaScript with ES6

### Tech/Framework used

* JavaScript / ES6
* Node.js
* Jest
* Eslint
* Winston
* Faker

### How to use?

* Step 1. Connect to telnet server in terminal. ```telnet <IP address> <PORT>```
* Step 2. Once you have connected to the chatroom you will be assigned a randomly generated username.
* Step 3. Now that you have joined, you may message the chatroom attendees. If you would like to further interact there are 4 commands that you can run.

#### Chatroom Commands:
* ```@list``` - will print out a list of people in the chatroom.
* ```@quit``` - will remove you from the chatroom.
* ```@name <new-username>``` - allows you to change your username to a name of your choice.
* ```@dm <to user-name> <message>``` - allows you to send a direct message to another member of the chatroom.

### Credits

* Code Fellows / Vinicio Vladimir Sanchez Trejo for providing the starter code.
* Andrew Bloom and I worked through the lab together.

### License

MIT © Catherine Looper




