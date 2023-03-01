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

//TEST LIGHTING ADD IN LIGHT OBJECT IN MODELS LATER!!!!
const light = new THREE.AmbientLight(0xffaaff);
light.position.set(10, 10, 10);
scene.add(light);

//test object (objName,pos,edgeLength,geometry,material,meshType,materialOptions,scene)
let testCube = new models.immovableCube(
    "Test Cube",
    {x:0,y:0,z:0},
    1,
    THREE.BoxGeometry,
    THREE.MeshBasicMaterial,
    THREE.Mesh,
    {color:0x00ff00},
    scene,
);

testCube.initElement();

//final animation and rendering
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();