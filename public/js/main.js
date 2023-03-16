import * as THREE from "three";
import * as models from './models/manifest.js';
import { PointerLockControls } from 'PointerLockControls';


let socket = io();

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
document.addEventListener('resize', e => renderer.setSize(innerWidth, innerHeight));

let RenderJobs = {arr:[]};

let plane_01 = new models.Plane(
    "plane test",
    {width:100,height:100,wSegments:1,hSegments:1},
    models.TextureLoader,
    {
        url:'public/assets/textures/floortexture.jpeg',
        material: THREE.MeshBasicMaterial
    },
    new THREE.Vector3(0,-6,-5),
    new THREE.Quaternion(-1.6,0,0,0),
    scene,
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
    },
        initElement: () => {
            socket.emit('camerainit', threeCamera.position);
        }
    },
    plane_01
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