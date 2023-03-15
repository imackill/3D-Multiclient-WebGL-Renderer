const express = require('express');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const sock = require('socket.io');
const http = require('http');

const PORT = 8888;

const app = express();
const server = http.createServer(app);
const io = new sock.Server(server);

app.use(favicon(`${__dirname}/public/assets/favicon.ico`));

app.use(express.static(`${__dirname}`));

app.get("/", (req,res) =>{
    res.sendFile('/index.html', {root: __dirname});
});

io.on('connection', (socket) => {
    console.log(`User ${socket.handshake.address} connected.`);
    
    //disconnect
    io.on('disconnect', (socket) => {
        console.log(`User ${socket.handshake.address} disconnected.`)
    });
});

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}\nroot dir is ${__dirname}`);
});