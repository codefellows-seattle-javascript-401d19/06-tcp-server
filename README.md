##  Documentation  
In your README.md describe the exported values of each module you have defined. Every function description should include it's arity (expected number of parameters), the expected data for each parameter (data-type and limitations), and it's behavior (for both valid and invalid use). Feel free to write any additional information in your README.md.

Also write documention for starting your server and connection using telnet. Write documentation for the chat room usage.

# Exported Modules

## Module: Server 

    This module makes the minimum available from the server code.  Its exclusive function is to allow the server to start and stop.  Any futher fuctionality is handled by the net library attached to and accessed by the private app object.

## Starting Server

  To start the server, server clone the entire directory from 06-TCP-SERVER

  In your command line, type \
  `node index.js`

  Open a new tab in your console and type \
  `telnet 127.0.0.1 3000`

  This will open a session of your chat room application, where you will receive a randomly generated username and session id.

## Chat Commands

### @list
    This can be used in each instatiation of your chat window to show other active members currently logged into the chat.

### @nickname \<nickname>

    You may enter this followed by a new nickname which will save upon entry.

### @dm \<user> \<message>
    Type @dm along with another user's name and a message and it will be sent upon entry.

## @quit
    Typing @quit will remove you from the curent chat session.


## Testing  
No testing required for this lab. Yay!

## Bonus 1pt
Use net.Socket to test your server. Your tests should include the ability to connect, send and receive messages, and run special commands.

## ##
