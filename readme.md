# Socket Implementation

## Overview

#### The project is consist for a server , console client & web client, where the console & web client can interact with the server. The server sends the instruction to client which is then followed by a response from client. The server eavlutes the response and based on the evaluation assigns the respective score to the client response. 
1. It assigns _**1**_ for correct evaluation
2. _**-1**_ for incorrect evaluation
3. _**0**_ for timeout of instruction

#### The winning condition is staisfied when the client successfully earns _**10**_ score points and the lossing condition is satisfied when the score reaches to the lowest level i.e _  **-3**  _ .

#### If the client missed to respond _3_ consecutive set of instruction from the server then the client connection gets terminated.

##### _**Note**: The score, instruction, timmer & set of messaged keep updating the console/web client respectively_

## Steps for execution

* Clone the repo
* Navigate to the cloned repo i.e `cd path-to-cloned-repo`
* Install dependencies `npm install`

#### Run Server
* Run the command `node server.js` or `npm run server`

#### Run Console client
* Run the command `node client.js` or `npm run client`

#### Run Web Client
* Visit browser at `http://localhost:9000/client.html`