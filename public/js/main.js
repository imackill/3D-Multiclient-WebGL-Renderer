import * as THREE from 'three';
import * as models from './models/manifest.js';

let frameUpdate = 0;

fetch("/users_pos")
    .then(res => res.json())
    .then(data=>console.log(data))
    .catch(err => console.error(err));

//Create test scene
const scene = new THREE.Scene();

//camera tests
let threeCamera = new models.KeyboardPerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
    scene,
    {x:0,y:0,z:5},
    {x:0,y:0,z:0}
    );

const renderer = new THREE.WebGLRenderer({alpha: true});
renderer.setClearColor( 0xffffff, 0);
renderer.setSize(window.innerWidth, window.innerHeight);
$("body").append(renderer.domElement);

let RenderJobs = {arr:[]}

//test cube for camera test
let cubeTest = new models.immovableCube(
    "test",
    {x:0,y:0,z:0},
    1,
    THREE.BoxGeometry,
    THREE.MeshBasicMaterial,
    THREE.Mesh,
    {color:0xff0000, wireframe:false},
    scene,
    {x:0,y:0,z:0},
    );
cubeTest.initElement();

let movingcubeTest = new models.movableCube(
    "moving",
    {x:3,y:0,z:0},
    1,
    THREE.BoxGeometry,
    THREE.MeshBasicMaterial,
    THREE.Mesh,
    {color:0xff00f0,wireframe:true},
    scene,
    {x:0,y:0,z:0},
    ()=>{
        //onupdate
    },
    ()=>{
        //oninit
    }
);

movingcubeTest.initElement();

movingcubeTest.drx+=0.01;

RenderJobs.arr.push(movingcubeTest);

//final animation and rendering
function animate() {
    requestAnimationFrame(animate);
    RenderJobs.arr.forEach((elem)=>elem.update(frameUpdate));
    renderer.render(scene, threeCamera);
    frameUpdate+=1;
}

animate();