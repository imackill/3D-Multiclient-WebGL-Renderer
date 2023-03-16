import * as THREE from 'three';

export class TextureLoader{
    constructor(args={url, material}){
        this.loader = new THREE.TextureLoader();
        this.material = args.material;
        this.url = args.url;
        this.texture = this.loader.load(this.url);
        this.texture.wrapS = this.texture.wrapT = THREE.RepeatWrapping;
        this.material = new this.material({map:this.texture});
        return this.material;
    }
}