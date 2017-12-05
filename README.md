## Purpose
This program creates a chatroom where users can talk to each other in either a group conversation or a private message using the @dm command (see Commands).

## How To Use
To use the program first install the dependcies using npm install. Then run 'npm run start' to initialize the program and connect to the server. You can open a new client session in a new tab on the terminal. In the new tab connect with telnet via 'telnet 127.0.01 3000'. 127.0.0.1 is your computer's local address and we will connect through port 3000. You can now chat with the entire group by typing a message or write to a specific person using @dm (see Commands). You can also exit the program, find out who else is connected, or set a new name for yourself with the commands below.

## Commands
* @quit : Disconnects the client from the server.
* @list : Lists all of the clients currently connected to the server.
* @nickname <new_nickname> : Resets the client's name to be the name provided as <new_nickname>. A valid name must be provided or the client will be prompted to reenter the command with a valid name. The name can be anything except an empty string.
For example @nickname Sarah will set your name to "Sarah"
* @dm <destination_username> <message> : Sends a private message to the user specified as <destination_username>. The message can be any length.
For example @dm Sarah How are you? Will send the message "How are you?" to the client with the username "Sarah".

## Technologies Used
* node
* jest
* net
* eslint
* faker
* winston
* ES6

## Credits
Vinicio Vladimir Sanchez Trejo & the Code Fellows curriculum provided the base .eslintrc, .eslintignore, .gitignore, index.js, log.json, and server.js files upon which the command functions were built.
