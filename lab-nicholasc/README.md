#index.js
Starts the server and uses Winston to maintain log files
to launch your server type into the command line from lab-nicholasc `node index.js`
#Server.js
Runs the server and uses Winston to maintain log files
in order to connect to telnet type `telnet 127.0.0.1 3000` into the command line
##parseCommand
takes in a line from the telnet server connection and parses the commmand at ' '. It then checks to see if a command was initiated as indicated by it beginning with '@'. If so, it executes said command. if it begins with '@' but is an invalid command, it lists the valid commands.
###commands
 /@list lists the users in the chatroom
 /@quit deletes the current users
 /@nickname allows the user to change their nickname
 /@dm allows one user to directly message another
