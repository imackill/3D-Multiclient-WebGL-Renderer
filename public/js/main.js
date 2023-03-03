import * as THREE from 'three';
import * as models from './models/manifest.js';

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
    2,
    THREE.BoxGeometry,
    THREE.MeshBasicMaterial,
    THREE.Mesh,
    {color:0x00ff00},
    scene,
    {x:0,y:0,z:0}
    );
cubeTest.initElement();

//final animation and rendering
function animate() {
    requestAnimationFrame(animate);
    RenderJobs.arr.forEach((elem)=>elem.update());
    renderer.render(scene, threeCamera);
}

animate();