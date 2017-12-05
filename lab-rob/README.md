# Code Fellows: Code 401d19: Full-Stack JavaScript

## Lab 06: TCP Server
A basic TCP server that allows multiple users to connect and send messages to each other. Think AIM meets the command line.

## Tech/frameworks/packages

- node 
- npm
- node packages
  - jest
  - eslint
  - dotenv
  - faker
  - winston
  - net

## Code Example

## Installation

1. Fork and clone https://github.com/RobertMcReed/06-tcp-server.git to your computer.
1. `cd` into `lab-rob/` and run `npm install`.
1. `touch .env` and add `PORT=3000`.

## Tests

N/A

## How to use?

After installation, from `lab-rob/` run `npm start` to start the server. 

From a different terminal window, use `telnet` to connect to the server. 

If you don't have `telnet` on your computer, get it using homebrew.

run `telnet 127.0.0.1 3000`.

You are now in the chat room and can chat it up!

### Commands

1. Type a message to send it to the other users.

1. Type `@me` to see your username.

1. Type `@quit` to disconnect from the server.

1. Type `@list` to list all of the users.

1. Type `@nickname <new-name>` to change your nickname.

1. Type `@dm <to-username> <message>` to send a message directly to a user.

## Contribute

You can totally contribute to this project if you want. Fork the repo, make some cool changes and then submit a PR.

## Credits

Initial codebase created by Vinicio Vladimir Sanchez Trejo.

## License

MIT. Use it up!