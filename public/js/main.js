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

socket.emit('camerainit', threeCamera.position);

let RenderJobs = {arr:[]};

//custom polyhedron
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

polyhedron_02.initElement();

//final animation and rendering
function animate() {
    requestAnimationFrame(animate);
    RenderJobs.arr.forEach((elem)=>elem.update(frameUpdate));
    renderer.render(scene, threeCamera);
    frameUpdate+=1;
}

animate();