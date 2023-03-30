import * as THREE from 'three';
import { TextureLoader } from './manifest.js';

export class playerPreset{
    constructor(
        name,
        position,
        rotation,
        json
    ){
        this.name = name;
        this.geometry = json.geometry;
        this.material = json.material;
        this.texture = json.texture;
        this.color = json.color;
        this.wireframe = json.wireframe;
        this.size = json.size;
        this.extra = json.extra;
        this.group = json.group;
        this.position = new THREE.Vector3(position.x,position.y,position.z);
        this.rotation = new THREE.Quaternion(rotation.x,rotation.y,rotation.z,rotation.w);
        this.boundingbox = new THREE.Box3();
        if(this.texture.incuded){
            this.material = new TextureLoader({url: this.texture.url, material:this.material, wrapping:this.texture.wrapping, repeat:this.texture.repeat})
        }else{
            this.material = new this.material({color:this.color, wireframe:this.wireframe});
        }
        this.mesh = new THREE.Mesh(new this.geometry(this.size.box, this.size.box, this.size.box),this.material);
        this.mesh.name = this.name;
        this.initElement = () => {
            this.mesh.position.set(position.x,position.y,position.z);
            this.mesh.rotation.set(rotation.x,rotation.y,rotation.z);
            this.id = this.mesh.id;
        }
        this.update = (worldData,collideables) => {
            let objectData = worldData[this.name];
            if(!objectData){return this.group.remove(this.mesh);}
            this.mesh.position.set(objectData.position.x,objectData.position.y,objectData.position.z);
            this.mesh.rotation.set(objectData.rotation._x,objectData.rotation._y,objectData.rotation._z);
            this.mesh.geometry.computeBoundingBox();
            this.boundingbox.copy(this.mesh.geometry.boundingBox).applyMatrix4(this.mesh.matrixWorld);
        }
    }
}