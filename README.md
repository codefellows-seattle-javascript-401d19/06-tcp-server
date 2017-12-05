![cf](https://i.imgur.com/7v5ASc8.png) Lab 06: TCP Chat Server
======

## TCP Chat Server in Node
* As a project for lab class at Code Fellows, this repo represents TCP chatroom in Node.

## Code Style
* Used Javascript and ES6

## Features
Using this chatroom clients should be able to connect using a telnet client, name themselves, view who is also in the chatroom and chat with each other. Available commands are: `@list`, `@name <new-name>`, `@nickname <new-name>` and `@quit`.

  type `@quit` to disconnect

  type `@list` to list all connected users


  type `@name <new-name>` to change their nickname


  type `@dm <users-name> <your-message>` to  send a message directly to another user by that name

## Tech / framework used
* [npm package faker](https://www.npmjs.com/package/faker) to generate random user names.
* [npm package winston](https://www.npmjs.com/package/winston) as a logging library.

## Installation

Run local server using this command `node index.js` and make sure that env port is set to `3000`.

To connect to the local server make sure you have telnet installed before running command `telnet 127.0.0.1 3000`

## How To Use
Once you start local server and connect your machine to it - type available commands for listing users, renaming, chatting, sending direct messages or just leaving the chat.

## Licence
MIT © Pedja Josifovic
