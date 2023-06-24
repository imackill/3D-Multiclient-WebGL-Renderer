import * as THREE from "three";
import * as models from './models/manifest.js';
import { PointerLockControls } from 'PointerLockControls';

const wsc = new WebSocket(`wss://${window.location.hostname}:${window.location.port}`); //main page is wss

let wsc_data = undefined;

//Create scene
const scene = new THREE.Scene();

let threeCamera = new THREE.PerspectiveCamera(83, window.innerWidth/window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({alpha: true});
renderer.setClearColor( 0xADD8E6, 1);
renderer.setSize(window.innerWidth, window.innerHeight);

const controls = new PointerLockControls(threeCamera, renderer.domElement);

renderer.domElement.addEventListener("click", () => {
    controls.lock();
});

$("body").append(renderer.domElement);

let speed = 1.0,
keyPressed = {};
let direction = new THREE.Vector3;
let update = () => {
    if (keyPressed["w"]){
        let worldDirection = threeCamera.getWorldDirection(direction);
        worldDirection.y = 0;
        threeCamera.position.addScaledVector(worldDirection, speed);
    }
    if (keyPressed["a"]){
        let worldDirection = threeCamera.getWorldDirection(direction);
        worldDirection.y = 0;
        threeCamera.position.addScaledVector(worldDirection.cross(new THREE.Vector3(0, 1, 0)).normalize(), -speed);
    }
    if (keyPressed["s"]){
        let worldDirection = threeCamera.getWorldDirection(direction);
        worldDirection.y = 0;
        threeCamera.position.addScaledVector(worldDirection, -speed);
    }
    if (keyPressed["d"]){
        let worldDirection = threeCamera.getWorldDirection(direction);
        worldDirection.y = 0;
        threeCamera.position.addScaledVector(worldDirection.cross(new THREE.Vector3(0, 1, 0)).normalize(), speed);
    }
    if (keyPressed[" "]){
        let worldDirection = new THREE.Vector3(0,1,0)
        threeCamera.position.addScaledVector(worldDirection, speed);
    }
    if (keyPressed["Shift"]){
        let worldDirection = new THREE.Vector3(0,-1,0);
        threeCamera.position.addScaledVector(worldDirection, -speed);
    }
};

setInterval(update, 10);

document.addEventListener('keydown', e => keyPressed[e.key] = true);
document.addEventListener('keyup', e => keyPressed[e.key] = false);
document.addEventListener('resize', () => renderer.setSize(innerWidth, innerHeight));

const RenderJobs = {groups:[], players:[],arr:[]};

const immovable_objectGroup = new THREE.Group();
immovable_objectGroup.name = "landscapegroup";

//player preset (temp) WILL CHANGE
let preset = {
    geometry:THREE.BoxGeometry,
    material:THREE.MeshBasicMaterial,
    texture:{
        included:true,
        url:'public/assets/textures/pngwing.com.png',
        wrapping:THREE.RepeatWrapping,
        repeat: new THREE.Vector2(1,1),
    },
    position: new THREE.Vector3(threeCamera.position.x, threeCamera.position.y, threeCamera.position.z,),
    rotation: new THREE.Quaternion(threeCamera.rotation.x, threeCamera.rotation.y, threeCamera.rotation.z,),
    color:null,
    wireframe:false,
    size:{
        box:4
    },
    extra:{},
    scene:scene,
}


let light_01 = new models.immovableLight(
    "ambient light",
    new THREE.Vector3(0,0,0),
    0xffffff,
    1,
    THREE.AmbientLight,
    scene
);


RenderJobs.camera =
    {
        update: () => {
        let cameraData = {
            position: new THREE.Vector3(threeCamera.position.x,threeCamera.position.y,threeCamera.position.z),
            rotation: new THREE.Quaternion(threeCamera.rotation._x,threeCamera.rotation._y,threeCamera.rotation._z,threeCamera.rotation._w)
        };
        if(!(wsc_data == undefined)){
            let world_req = {
                type:"PlayerUpdateRequest",
                code:null,
                text:"Update player position in global scene",
                data: {
                    client:wsc_data.client,
                    orientation: cameraData,
                },
            }
            wsc.send(JSON.stringify(world_req));
        }
    },
        initElement: () => {
            console.log(`Initialized Camera`);
        }
    },
RenderJobs.arr.push(
    light_01
);

RenderJobs.camera.initElement();

RenderJobs.groups.push(immovable_objectGroup);

RenderJobs.arr.forEach(elem => elem.initElement());

RenderJobs.groups.forEach(elem => {
    scene.add(elem);
});

//rendering player objects
wsc.onmessage = (message) => {
    const data = JSON.parse(message.data);
    switch (data.type) {
        case "ConnectionResponse":
            wsc_data = data;
            break;

        case "DataResponse":
            let clientid = data.data.client.id;
            let globalSceneArray = data.data.global_arr;//consider changing- no more data.data
            let renderSceneArray = globalSceneArray;
            let worldData = data.data.world;
            let PBitMap = worldData.terrainMap;
            let PBitTerrainGroup = new THREE.Group();
            if(!scene.getObjectByName("Terrain")){
                const BLOCKSIZE = data.data.BLOCKSIZE;
                PBitTerrainGroup.name = "Terrain";
                let rowcount = 0;
                let columncount = 0;
                PBitMap.forEach(row => {
                    row.forEach(cell => {
                        let cellpos = new THREE.Vector3(rowcount, cell/2, columncount);
                        let cellBox = new models.immovableCube(
                            `World-Column-(${cell},${row})`,
                            cellpos,
                            {
                                x:BLOCKSIZE,
                                y:cell,
                                z:BLOCKSIZE,
                            },
                            THREE.BoxGeometry,
                            THREE.MeshStandardMaterial,
                            THREE.Mesh,
                            {
                                color:0x00ff00,
                                wireframe:false,
                            },
                            PBitTerrainGroup,
                            new THREE.Quaternion(0,0,0,'_XYZ'),
                            {
                                edges:true,
                                edgesColor:0x000000,
                            }

                        );
                        cellBox.initElement();
                        columncount+=BLOCKSIZE
                    });
                    rowcount+=BLOCKSIZE;
                    columncount = 0;
                });
            }
            scene.add(PBitTerrainGroup);
            renderSceneArray.forEach(player => {
                let pos = player.position;
                let rot = player.rotation;
                if(scene.children.map(object => object.name).includes(player.id)){
                    scene.getObjectByName(player.id).position.set(pos.x,pos.y,pos.z);
                    scene.getObjectByName(player.id).rotation.set(rot._x,rot._y,rot._z);
                }else{
                    let playerObject = new models.playerPreset(
                        player.id,
                        pos,
                        rot,
                        preset
                    );
                    playerObject.initElement();
                    RenderJobs.players.push(playerObject);
                }
            });
            scene.getObjectByName(clientid).visible = false;
            break;

        case "DisconnectBroadcast":
            let clientDisconnect = data.data.client;
            let clientObject = scene.getObjectByName(clientDisconnect.id);
            clientObject.removeFromParent();
            break;

        default:
            break;
    }

}

//final animation and rendering
function animate() {
    requestAnimationFrame(animate);
    RenderJobs.camera.update();
    renderer.render(scene, threeCamera);
    RenderJobs.players.forEach(player =>{
        player.boundingbox.copy(player.mesh.geometry.boundingBox).applyMatrix4(player.mesh.matrixWorld);
        let intersects = player.checkforIntersection();
    });
    /*RenderJobs.arr.forEach(terrain =>{
        terrain.boundingbox.copy(terrain.mesh.geometry.boundingBox).applyMatrix4(terrain.mesh.matrixWorld);
    });*/
}

animate();
