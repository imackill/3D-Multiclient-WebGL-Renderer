import * as THREE from "three";
import * as models from './models/manifest.js';
import { PointerLockControls } from 'PointerLockControls';

let socket = io();
let worldData = {};
let frameUpdate = 0;

//Create test scene
const scene = new THREE.Scene();

let threeCamera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

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

//player preset (temp)
let preset = {
    geometry:THREE.BoxGeometry,
    material:THREE.MeshStandardMaterial,
    texture:{
        included:false,
        url:'',
        wrapping:null,
        repeat: new THREE.Vector2(0,0),
    },
    position: new THREE.Vector3(threeCamera.position.x, threeCamera.position.y, threeCamera.position.z,),
    rotation: new THREE.Quaternion(threeCamera.rotation.x, threeCamera.rotation.y, threeCamera.rotation.z,),
    color:0x000000,
    wireframe:true,
    size:{box:4},
    extra:{},
    group:scene,
}

let globalworldArray = [];

socket.on("player_connect", (predata) => {
    globalworldArray = Object.keys(predata).map(elem => {
        elem = {elem:predata[elem]};
    });
    globalworldArray.forEach(playerData => {
        console.log(playerData);
        if(!playerData)return;
        let playerObject = new models.playerPreset(
            Object.keys(playerData),
            playerData[Object.keys(playerData)[0]].position,
            playerData[Object.keys(playerData)[0]].rotation,
            preset
        );
        RenderJobs.players.push(playerObject);
    });
});

socket.on("player_update", (data) => {
    worldData = data[0];
    let userAddress = data[1];
    delete data[0][userAddress];
    globalworldArray = Object.keys(worldData).map(elem => {
        let dict = {};
        dict[`${elem.toString()}`] = worldData[elem];
        return dict;
    });
    globalworldArray.forEach(playerData => {
        let playerAddresses = RenderJobs.players.map(i => i.name);
        let currentAddress = Object.keys(playerData)[0];
        if(!(playerAddresses.includes(currentAddress))){
            let playerObject = new models.playerPreset(
                currentAddress,
                playerData[Object.keys(playerData)[0]].position,
                playerData[Object.keys(playerData)[0]].rotation,
                preset
            );
            RenderJobs.players.push(playerObject);
            scene.add(playerObject.mesh);
        }else{
            return;
        }
    });
});

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

RenderJobs.arr.push(
    {
        update: () => {
        threeCamera.position.x = position.x;
        threeCamera.position.y = position.y;
        threeCamera.position.z = position.z;
        socket.emit("camera move", {position:threeCamera.position,rotation:threeCamera.rotation});
    },
        initElement: () => {
            console.log(`Initialized Camera`);
        }
    },
    plane_01,
    light_01
);
RenderJobs.groups.push(immovable_objectGroup);

RenderJobs.arr.forEach(elem => elem.initElement());

RenderJobs.groups.forEach(elem => {
    scene.add(elem);
});

//final animation and rendering
function animate() {
    requestAnimationFrame(animate);
    RenderJobs.arr.forEach((elem)=>{
        try{elem.update(frameUpdate)}catch(e){/*pass*/}
    });
    RenderJobs.players.forEach((elem)=>{
        elem.update(worldData, immovable_objectGroup.children);
    });
    renderer.render(scene, threeCamera);
    frameUpdate+=1;
}

animate();