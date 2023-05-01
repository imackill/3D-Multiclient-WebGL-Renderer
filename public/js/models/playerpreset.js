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
        this.scene = json.scene;
        this.position = new THREE.Vector3(position.x,position.y,position.z);
        this.rotation = new THREE.Quaternion(rotation.x,rotation.y,rotation.z,rotation.w);
        this.boundingbox = new THREE.Box3();
        if(this.texture.incuded){
            this.material = new TextureLoader(
                {
                    url: this.texture.url,
                    material:this.material,
                    wrapping:this.texture.wrapping,
                    repeat:this.texture.repeat
                }
            );
        }else{
            this.material = new this.material({color:this.color, wireframe:this.wireframe});
        }
        this.mesh = new THREE.Mesh(new this.geometry(this.size.box, this.size.box, this.size.box),this.material);
        this.initElement = () => {
            this.mesh.name = this.name;
            this.mesh.position.set(position.x,position.y,position.z);
            this.mesh.rotation.set(rotation.x,rotation.y,rotation.z);
            this.scene.add(this.mesh);
        }
        this.update = () => {
            this.scene.getObjectByName(this.name).position.set(this.position.x,this.position.y,this.position.z);
            this.scene.getObjectByName(this.name).rotation.set(this.rotation._x,this.rotation._y,this.rotation._z);
        }
        this.toJSON = () => {
            let userData = {};
            userData[this.name] = {
                address:this.name,
                position:this.position,
                rotation:this.rotation,
            };
            return JSON.stringify(userData);
        }
    }
}