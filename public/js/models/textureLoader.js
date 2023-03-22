import * as THREE from 'three';

export class TextureLoader{
    constructor(args={url, material, wrapping, repeat}){
        this.wrapping = args.wrapping;
        this.repeat = args.repeat;
        this.loader = new THREE.TextureLoader();
        this.material = args.material;
        this.url = args.url;
        this.texture = this.loader.load(this.url);
        this.texture.repeat = this.repeat;
        this.texture.wrapS = this.texture.wrapT = this.wrapping;
        this.material = new this.material({map:this.texture});
        return this.material;
    }
}