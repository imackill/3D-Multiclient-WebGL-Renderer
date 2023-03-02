const express = require('express');
const favicon = require('serve-favicon');
const fs = require('fs');

const PORT = 3000;

const server = express();

server.use(favicon(`${__dirname}/public/assets/favicon.ico`));

server.use(express.static(`${__dirname}`));

server.get("/", (req,res) =>{
    res.sendFile(`/`, {root: __dirname});
});

server.get("/users_pos", (req,res) => {
    res.json(fs.readFile(`${__dirname}/data/userpos.json`, (err) => {
        return `Error, could not access file ${__dirname}/data/userpos.json.\n${err}`;
    }));
});

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}\nroot dir is ${__dirname}`);
});