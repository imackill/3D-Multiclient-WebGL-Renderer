const THREE = require('three');
const models = require('./models/manifest.js');


//Create test scene
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//camera position
camera.position.z = 0;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
$("body").append(renderer.domElement);

//test object (objName,pos,edgeLength,geometry,material,meshType,materialOptions,scene)
let testCube = new models.immovableCube(
    "Test Cube",
    {x:0,y:0,z:-5},
    1,
    THREE.BoxGeometry,
    THREE.MeshBasicMaterial,
    THREE.Mesh,
    {color:0x00ff00},
    scene,
);

testCube.initElement();

console.log(testCube.mesh);

//final animation and rendering
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();