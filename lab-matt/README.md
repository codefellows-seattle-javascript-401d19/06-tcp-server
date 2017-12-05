# 06: TCP Server
Description: **Lab 06 of Code Fellows JavaScript 401d19** </br>
Author: **Matthew LeBlanc** </br>
Date: **12/04/17**

## Features
This lab starts a local TCP chatroom that allows you to communicate with anyone else connected to the server

#### commands
- `@quit` - allows the user to disconnect from the chatroom
- `@list` - lists all the current connected users
- `@nickname <new nickname>` - allows a user to change their randomized nickname
- `@nickname` without any command returns the users current name
- `@dm <username> <message>` - allows a user to send a direct message to a specific user
- `@` followed by anything that is not one of the commands gives a list of all the commands

## Setup
1. `cd` into the lab-matt repository
2. `npm install` make sure `faker` `net` and `winston` are installed.
3. `export PORT=<port>` make sure to specify a port for your server in your `process.env` || or set the `PORT` manually in `index.js`.
4. in your terminal `node index.js` to start the server
5. connect to the server with `telnet <severIP> <PORT>`
6. Start chatting away!