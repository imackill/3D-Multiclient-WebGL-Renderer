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

const shinyCube = new models.immovableCube(
    "Shiny",
    {x:0,y:0,z:0},
    1,
    THREE.BoxGeometry,
    THREE.MeshStandardMaterial,
    THREE.Mesh,
    {color:0x00ff00},
    scene
    );



//final animation and rendering
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();