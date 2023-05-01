/*
                                        TO DO
        -Overhaul playerpreset system and player objects (maybe random shape)
*/
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

let speed = 0.2, maxSpeed = speed, friction = 0.91, 
    position = { x: 0, y: 0, z: 0 },
    velocity = { x: 0, y: 0, z: 0 },
    keyPressed = {};

let update = () => {
    if (keyPressed["w"] && velocity.z > -maxSpeed) velocity.z -= speed;
    if (keyPressed["s"] && velocity.z < maxSpeed) velocity.z += speed;
    if (keyPressed["a"] && velocity.x > -maxSpeed) velocity.x -= speed;
    if (keyPressed["d"] && velocity.x < maxSpeed) velocity.x += speed;
    if (keyPressed["Shift"] && velocity.y > -maxSpeed) velocity.y -= speed;
    if (keyPressed[" "] && velocity.y < maxSpeed) velocity.y += speed;
    velocity.z *= friction;
    velocity.x *= friction;
    velocity.y *= friction;
    position.z += velocity.z * Math.cos(threeCamera.rotation.x);
    position.x += velocity.z * Math.sin(threeCamera.rotation.y); 
    position.z -= velocity.x * Math.sin(threeCamera.rotation.y); 
    position.x += velocity.x * Math.cos(threeCamera.rotation.x);
    position.y += velocity.y;
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
    material:THREE.MeshStandardMaterial,
    texture:{
        included:true,
        url:'https://i.pinimg.com/280x280_RS/3b/d9/40/3bd9409cd8cc9c46c67c28f0e8fc57a3.jpg',
        wrapping:THREE.RepeatWrapping,
        repeat: new THREE.Vector2(0,0),
    },
    position: new THREE.Vector3(threeCamera.position.x, threeCamera.position.y, threeCamera.position.z,),
    rotation: new THREE.Quaternion(threeCamera.rotation.x, threeCamera.rotation.y, threeCamera.rotation.z,),
    color:0x000000,
    wireframe:false,
    size:{box:4},
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

let plane_01 = new models.Plane(
    "plane test",
    {width:100,height:100,wSegments:10,hSegments:10},
    models.TextureLoader,
    {
        url:'public/assets/textures/floortexture.jpeg',
        material: THREE.MeshBasicMaterial,
        wrapping: THREE.RepeatWrapping,
        repeat: new THREE.Vector2(10,10),
    },
    new THREE.Vector3(0,-6,-5),
    new THREE.Quaternion((3*Math.PI)/2,0,0,0),
    immovable_objectGroup,
    () => {
        console.log(`Initialized "${plane_01.name}"`);
    },
    () => {}
)

RenderJobs.camera =
    {
        update: () => {
        threeCamera.position.x = position.x;
        threeCamera.position.y = position.y;
        threeCamera.position.z = position.z;
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
    plane_01,
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
            clientDisconnect = data.data;
            scene.getObjectByName(data.client.id).remove();
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
}

animate();