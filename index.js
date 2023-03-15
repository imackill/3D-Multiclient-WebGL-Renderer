const express = require('express');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const http = require('http');
const { Server } = require('socket.io');

const PORT = 3000;

const server = express();
const httpServer = http.createServer(server);
const io = new Server(httpServer);

server.use(favicon(`${__dirname}/public/assets/favicon.ico`));

server.use(express.static(`${__dirname}`));

server.get("/", (req,res) =>{
    res.sendFile('/index.html', {root: __dirname});
});

io.on('connection', (socket) => {
    console.log(`User ${socket.handshake.address} connected.`);

    io.on('disconnect', (scoket) => {
        console.log(`User ${socket.handshake.address} disconnected.`)
    });
});

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}\nroot dir is ${__dirname}`);
});