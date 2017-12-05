# Code Fellows 401 Lab 6
The purpose of this lab is to build a simple chatroom using a TCP server.

## Code Style
Standard Javascript with ES6.

## Features
This simple chatroom assigns new users a username upon connecting to the chatroom.  They can type messages that are sent to all other users.  Users can also change their username, quit the chatroom, list all other active users, and send a direct message to another user.

## Running the Server
To run the server, download the repo.  Install dependencies via ```npm install```.  Then, ```node index.js```.

From another terminal window, log into the chatroom as a user by ```telnet 127.0.0.1 3000```.

## Chatroom commands
* Send message to all:  Type the message and hit enter.
* Show available commands: ```@<anything>```
* Change nickname: ```@nickname <newNickname>```
* Show other users: ```@list```
* Send direct message: ```@dm <username> <message>```
