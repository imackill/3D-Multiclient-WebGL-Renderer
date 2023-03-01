const express = require('express');
const favicon = require('serve-favicon');

const PORT = 3000;

const server = express();

server.use(favicon(`${__dirname}/public/assets/favicon.ico`));

server.use(express.static(`${__dirname}`));

server.get("/", (req,res) =>{
    res.sendFile(`/`, {root: __dirname});
});

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}\nroot dir is ${__dirname}`);
});