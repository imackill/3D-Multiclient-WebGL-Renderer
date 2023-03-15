import * as THREE from "three";
import * as models from './models/manifest.js';
import { PointerLockControls } from 'PointerLockControls';

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

let RenderJobs = {arr:[]}

//cube test
let movingcubeTest = new models.movableCube(
    "moving",
    {x:0,y:0,z:-5},
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
        movingcubeTest.drx+=0.01;
    }
);

movingcubeTest.initElement();

RenderJobs.arr.push(movingcubeTest);

//final animation and rendering
function animate() {
    requestAnimationFrame(animate);
    RenderJobs.arr.forEach((elem)=>elem.update(frameUpdate));
    renderer.render(scene, threeCamera);
    frameUpdate+=1;
}

animate();