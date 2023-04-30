const express = require('express');
const favicon = require('serve-favicon');
const http = require('http');
const fs = require('fs');
const ws = require('ws');
const dotenv = require('dotenv');
const uuid = require('node-uuid');

dotenv.config();

const PORT = parseInt(process.env.PORT);

const app = express();
const server = http.createServer(app);


server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}\nroot dir is ${__dirname}`);
});

if(!fs.existsSync(`data`)){
    fs.mkdirSync(`data`);
    fs.writeFileSync(`data/userpos.json`, JSON.stringify({"objects":[]}));
}

app.use(favicon(`${__dirname}/public/assets/favicon.ico`));

app.use(express.static(`${__dirname}`));

app.get("/", (req,res) =>{
    res.sendFile('/index.html', {root: __dirname});
});

const wss = new ws.Server({server});

const userMap = new Map();

function getSocketbyID(id) {
    if(!(userMap.has(id))){
        console.error(`No connected socket found with the following ID: ${id}`);
    }else{
        userMap.get(id);
    }
}

wss.on('connection', (ws,req) => {
    let id = uuid.v4();
    ws.id = id;
    userMap.set(id, ws);
    ws.on('close', () => userMap.delete(id));
    console.log(`User ${ws._socket.remoteAddress} connected with id ${ws.id}.`);
    let connection_res = JSON.stringify({
        type:"ConnectionResponse",
        code:200,
        text:"OK",
        client:{
            address: ws._socket.remoteAddress,
            id: id,
        }
    })
    ws.send(connection_res);

    ws.on('message', (data, isBinary) => {
        const message = isBinary ? data : data.toString();
        const wsc_req = JSON.parse(message);
        let userposJSONData = JSON.parse(fs.readFileSync(`data/userpos.json`));
        let currentObjectArray = userposJSONData.objects;
        let currentObjectIDs = currentObjectArray.map(object => object.id);
        let playerUpdateData = {
            position: wsc_req.data.orientation.position,
            rotation: wsc_req.data.orientation.rotation,
            id: wsc_req.data.client.id,
            address: wsc_req.data.client.address
        }
        if(currentObjectIDs.indexOf(playerUpdateData.id) == -1){
            currentObjectArray.push(playerUpdateData);
        }else{
            currentObjectArray.splice(currentObjectIDs.indexOf(playerUpdateData.id), 1, playerUpdateData);
        }
        userposJSONData.objects = currentObjectArray;
        fs.writeFileSync(`data/userpos.json`, JSON.stringify(userposJSONData));

        //send response
        let data_response = {
            type:"DataResponse",
            code:200,
            text:"OK",
            data:{
                global_arr:currentObjectArray,
                client:wsc_req.data.client
            }
        }
        ws.send(JSON.stringify(data_response));
    });

    ws.on('close', (event) => {
        let userposJSONData = JSON.parse(fs.readFileSync(`data/userpos.json`));
        let currentObjectArray = userposJSONData.objects
        let currentObjectIDs = currentObjectArray.map(object => object.id);
        if(currentObjectIDs.indexOf(ws.id) != -1){
            currentObjectArray.splice(currentObjectIDs.indexOf(ws.id),1);
        }
        let close_response = {
            type:"DisconnectBroadcast",
            code:null,
            text:"User disconnected.",
            data:{
                client:{
                    address:ws._socket.remoteAddress,
                    id:ws.id
                },
                timestamp:Date.now().toLocaleString()
            }
        }
        wss.clients.forEach(ws => {
            ws.send(JSON.stringify(close_response));
        });
        userposJSONData.objects = currentObjectArray;
        fs.writeFileSync(`data/userpos.json`, JSON.stringify(userposJSONData));
        console.log(`User ${ws._socket.remoteAddress} successfully disconnected with id ${ws.id}.`)
    });
});