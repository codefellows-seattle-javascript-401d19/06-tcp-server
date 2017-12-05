# TCP Chat Server

A TCP chat servers bring back the days before we had we browsers. If you've ever used
IRC or are old enough to remember BBS's, you've used a TCP chat server. This project
uses Node.js to handle realtime chat amongst users over a telnet connection. Enjoy!

# Code Style

Standard

# Screenshots

~[alt text]()

# Tech/framework used

### Build with:

#### Main
- Node.js

#### Linter
- eslint

#### Testing
- jest

#### Etc
- dotenv
- faker
- uuid
- winston

# Features

Allows for broadcasting messages to all users by default, but also includes a direct
message feature for privacy. Viewing all online users is easy with the @list command
and renaming your nickname (username) is easy with the @nickname command. Quitting
the chat server is achieved via @quit.

All features supported by the chat server providing peritinent updates to online users
in the event a user should update their nickname, join or quit the server. Nicknames
cannot be duplicated (no identity fraud here!).

# Installation

1. Clone this repo
2. Run `npm install`
3. `npm run start` from the root directory of the chat server repo
4. `telnet <ip-address> <port-number>` where `<port-number>` is 3000


If you don't have telnet on your computer by default:
- Linux: `apt-get install telnet` depending on your distro
- Mac: `brew install telnet`
- Windows: refer to these [docs](https://technet.microsoft.com/en-us/library/cc771275(v=ws.10).aspx)

# How to use?

Once properly installed and you have successfully ran telnet on port 3000, you may
immediately begin entering text which will be broadcast globally.

Additionally, the following commands may be used:
- `@quit` will log you out of the chatroom
- `@list` will list all currently online users
- `@nickname <new-name>` will update the default nickname assigned to you upon login
- `@dm <to-username> <message>` will send a direct message to the username

# Credits

- Cameron Moorehead [github](https://github.com/CameronMoorehead)

# License

GPL
