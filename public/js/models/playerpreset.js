import * as THREE from 'three';
import { TextureLoader } from './manifest.js';

export class playerPreset{
    constructor(
        name,
        position,
        rotation,
        json
    ){
        this.geometry = json.geometry;
        this.material = json.material;
        this.texture = json.texture;
        this.color = json.color;
        this.wireframe = json.wireframe;
        this.size = json.size;
        this.extra = json.extra;
        this.scene = json.scene;
        this.position = new THREE.Vector3(position.x,position.y,position.z);
        this.rotation = new THREE.Quaternion(rotation.x,rotation.y,rotation.z,rotation.w);
        if(this.texture.incuded){
            this.material = new TextureLoader({url: this.texture.url, material:this.material})
        }else{
            this.material = new this.material({color:this.color, wireframe:this.wireframe});
        }
        this.mesh = new THREE.Mesh(new this.geometry(this.size.box),this.material);
        this.initElement = () => {
            this.mesh.position.set(position.x,position.y,position.z);
            this.mesh.rotation.set(rotation.x,rotation.y,rotation.z);
            this.scene.add(this.mesh);
        }
        this.update = (worldData) => {
            let objectData = worldData[this.name];
            this.mesh.position.set(objectData.position.x,objectData.position.y,objectData.position.z);
            this.mesh.rotation.set(objectData.rotation.x,objectData.rotation.y,objectData.rotation.z);
        }
    }
}