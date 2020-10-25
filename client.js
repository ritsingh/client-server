// Imports
var socket = require('socket.io-client')('http://localhost:9000');
const repl = require('repl')
const chalk = require('chalk');

// Local declarations
let timeInterval;
let timeLeft = 0;
let instructionKey;
let missedKeyCount = 0;

// Listen to connection establishment event and show basic set of instructions
socket.on('connect', () => {
    console.log('Instruction:');
    console.log('1: Presss the key which is displayed on your screen with in 10 seconds to score max.');
    console.log('2: The score of 10 indicates winner.');
    console.log('3: The score of -3 indicates Looser.');
    console.log('4: To quit at any point press '+chalk.red('`ctrl + c` '));

})

// Show greetings to the connceted client
socket.on('welcome', (data) => {
    console.log(chalk.green(data));
    console.log(chalk.blue('=== start ==='));
});

// Listen to the instructions from the server
socket.on('newKeyPressed', (data) => {
  clearTimeout(timeInterval); 
  console.log(`${chalk.blue('New instruction from server is:')} ${data.key} \n ${chalk.yellow('Current Score: '+data.score)}`);
  instructionKey = data.key;
  timeLeft = data.timeLeft;
  timeInterval = counter('You took to long to respond to the server instruction.');
})

// Display result
socket.on('result', function (data) {
  socket.emit('timeout');
  clearTimeout(timeInterval);
  console.log(chalk.yellow(`Current Score: ${data.score}`));
  console.log(`${chalk.green('Result: ')} ${chalk.yellow(data.result)}`);
  process.exit(0);
});

// Read client input 
const readline = require('readline');
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
// Send response to the server
process.stdin.on('keypress', (str, key) => {
  if (key.ctrl && key.name === 'c') {
    process.exit();
  } else {
    console.log(`You pressed the "${str}" key`);
    missedKeyCount = 0;
    clearTimeout(timeInterval); 
    timeLeft = 10;
    timeInterval = counter('There is no instruction shared by the server!!!');
    socket.send({ reply: str });
  }
});

// Method to show time interval
const counter = (msg) => {
  return setInterval(() => {
    if(timeLeft === 0){
      ++missedKeyCount;
      if(missedKeyCount === 1){
        console.log(`Timedout: ${msg}`);
      }
      let shouldExit = missedKeyCount >= 3 ? 1 : 0;
      socket.emit('timeout', shouldExit);
      if(shouldExit){
        console.log('Either You or Server is not interacting. Please try again.')
        process.exit(0)
      }
    } else {
      --timeLeft;
      console.log(chalk.blue(`Time Left: ${timeLeft}`));
    }
  }, 1000);
}
