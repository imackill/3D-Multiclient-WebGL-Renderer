const express = require('express');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const sock = require('socket.io');
const http = require('http');
const fs = require('fs');

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
    let pos_data = JSON.parse(fs.readFileSync('data/userpos.json'));
    socket.broadcast.emit("player connect", pos_data);

    socket.on("camera move", (worldData) => {
        let pos_data = JSON.parse(fs.readFileSync('data/userpos.json'));
        pos_data[`${socket.handshake.address}`] = worldData;
        fs.writeFileSync('data/userpos.json',JSON.stringify(pos_data));
        socket.emit("player update", [pos_data, socket.handshake.address]);
    });

    socket.on("disconnect", () => {
        let pos_data = JSON.parse(fs.readFileSync('data/userpos.json'));
        delete pos_data[`${socket.handshake.address}`];
        fs.writeFileSync('data/userpos.json', JSON.stringify(pos_data));
        console.log(`${socket.handshake.address} disconnected.`);
    });    
});

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}\nroot dir is ${__dirname}`);
});