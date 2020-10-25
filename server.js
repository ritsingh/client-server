// Imports
const express = require('express');
const app = express();
const socketio = require('socket.io');
const readline = require('readline');

app.use(express.static(__dirname + '/public'));
// Server listens at port 9000
const expressServer = app.listen(9000);
const io = socketio(expressServer);

// Local declarations
let maxTimeOutLimit;
let score;
let result;
let instruction;

// Listen to connection event
io.on('connection',(socket)=>{
  // Reset default values after connction is eastablished
	maxTimeOutLimit = 10;
	score = 0;
	result = '';
	instruction = '';
  // Send greetings to the connected client
  socket.emit('welcome',`Welcome ${socket.id}`);

  // Listen to the response from the client
  socket.on('message', function(data) {
  	if(data.reply && instruction){
    	if(data.reply.toLowerCase() == instruction.toLowerCase())
    		console.log(++score);
    	else
    		console.log(--score);
    	instruction = '';
  	}

  	if(score <= -3)
		result = 'Ohh!! You lost \n Give it a try again';
  	else if(score === 10)
		result = 'Hurrah!! You won!!!';

  	if(result !== '')
  		socket.emit('result', { result , score });
  })

	socket.on('timeout', function(shouldExit = 1) {
		console.log('Send new instruction to client.')
		if(shouldExit){
  			socket.disconnect();
		}
	});

})

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on('keypress', (str, key) => {
  if (key.ctrl && key.name === 'c') {
    process.exit(0);
  } else {
  	instruction = str;
  	io.emit('newKeyPressed', { key: str, timeLeft: maxTimeOutLimit, score })
    console.log(`You pressed the "${str}" key`);
  }
});

 