import * as THREE from 'three';
import * as models from './models/manifest.js';

const frameUpdate = 0;

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
    {color:0x00ff00},
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
    {color:0xff00f0},
    scene,
    {x:0,y:0,z:0},
    ()=>{},
    ()=>{
        this.dx+=1;
        setTimeout(this.dx-=1,500);
    }
);

movingcubeTest.initElement();

movingcubeTest.drx+=0.01;
movingcubeTest.dry+=0.01;

RenderJobs.arr.push(movingcubeTest);

//final animation and rendering
function animate() {
    requestAnimationFrame(animate);
    RenderJobs.arr.forEach((elem)=>elem.update(frameUpdate));
    renderer.render(scene, threeCamera);
    frameUpdate+=1;
}

animate();