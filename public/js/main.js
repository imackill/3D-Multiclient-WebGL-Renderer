import * as THREE from 'three';
import * as models from './models/manifest.js';

//Create test scene
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//camera position
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({alpha: true});
renderer.setClearColor( 0xffffff, 0);
renderer.setSize(window.innerWidth, window.innerHeight);
$("body").append(renderer.domElement);

//movement test
let moving = new models.movableCube(
    "moving test",
    {x:0,y:0,z:0},
    1,
    THREE.BoxGeometry,
    THREE.MeshBasicMaterial,
    THREE.Mesh,
    {color: 0x00ff00},
    scene,
    {x:0,y:0,z:0}
);

moving.initElement();

//movement tests
moving.drx = 0.05;
moving.drx = 0.05;
moving.drx = 0.05;

//movement tests
moving.dx = 0.005;
moving.dy = 0.005;
moving.dz = 0.005;

let RenderJobs = {arr:[]}

RenderJobs.arr.push(moving);

//final animation and rendering
function animate() {
    requestAnimationFrame(animate);
    RenderJobs.arr.forEach((elem)=>elem.update());
    renderer.render(scene, camera);
}

animate();