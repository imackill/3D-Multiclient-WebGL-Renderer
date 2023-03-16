import * as THREE from "three";
import * as models from './models/manifest.js';
import { PointerLockControls } from 'PointerLockControls';


let socket = io();

let frameUpdate = 0;

//Create test scene
const scene = new THREE.Scene();

let threeCamera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({alpha: true});
renderer.setClearColor( 0xffffff, 0);
renderer.setSize(window.innerWidth, window.innerHeight);

const controls = new PointerLockControls(threeCamera, renderer.domElement);

renderer.domElement.addEventListener("click", () => {
    controls.lock();
});

$("body").append(renderer.domElement);

let speed = 0.1, maxSpeed = 0.1, friction = 0.91, 
    position = { x: 0, y: 0, z: 0 },
    velocity = { x: 0, y: 0, z: 0 },
    rotation = 0, keyPressed = {};

let update = () => {
    if (keyPressed["w"] && velocity.z > -maxSpeed) velocity.z -= speed;
    if (keyPressed["s"] && velocity.z < maxSpeed) velocity.z += speed;
    if (keyPressed["a"] && velocity.x > -maxSpeed) velocity.x -= speed;
    if (keyPressed["d"] && velocity.x < maxSpeed) velocity.x += speed;
    velocity.z *= friction;
    velocity.x *= friction;
    position.z += velocity.z * Math.cos(threeCamera.rotation.x);
    position.x += velocity.z * Math.sin(threeCamera.rotation.y); 
    position.z -= velocity.x * Math.sin(threeCamera.rotation.y); 
    position.x += velocity.x * Math.cos(threeCamera.rotation.x);
};

setInterval(update, 10);

document.addEventListener('keydown', e => keyPressed[e.key] = true);
document.addEventListener('keyup', e => keyPressed[e.key] = false);
document.addEventListener('resize', e => renderer.setSize(innerWidth, innerHeight));

let RenderJobs = {arr:[]};

//custom polyhedron test: movement
let polyhedron_02 = new models.movablePolyhedron(
    "I hate threejs polyhedrons",
    {x:0,y:0,z:-7},
    [
        new THREE.Vector3(1,1,1),
        new THREE.Vector3(-1,-1,1),
        new THREE.Vector3(-1,1,-1),
        new THREE.Vector3(1,-1,-1),
    ],
    [
        new THREE.Vector3(2,1,0),
        new THREE.Vector3(0,3,2),
        new THREE.Vector3(1,3,0),
        new THREE.Vector3(2,3,1),
    ],
    3,
    20,
    THREE.MeshBasicMaterial,
    {color:0x000000, wireframe:true},
    scene,
    {x:0,y:0,z:0,w:0},
    ()=>{
        //onupdate
    },
    ()=>{
        polyhedron_02.dry+=0.01
    }
);

RenderJobs.arr.push(polyhedron_02);
RenderJobs.arr.push(
    {
        update: () => {
        threeCamera.position.x = position.x;
        threeCamera.position.z = position.z;
    },
        initElement: () => {
            socket.emit('camerainit', threeCamera.position);
        }
    }
);

RenderJobs.arr.forEach(elem => elem.initElement());

//final animation and rendering
function animate() {
    requestAnimationFrame(animate);
    RenderJobs.arr.forEach((elem)=>elem.update(frameUpdate));
    renderer.render(scene, threeCamera);
    frameUpdate+=1;
}

animate();