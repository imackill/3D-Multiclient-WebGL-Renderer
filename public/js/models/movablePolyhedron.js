import * as THREE from "three";
import { immovablePolyhedron } from "./manifest.js";

export class movablePolyhedron extends immovablePolyhedron{
    constructor(//honestly this shape is  specific and not user friendly (neither is the base class)
        name,
        pos,
        vertexArray,//array of {x:,y:,z:} objects (points)
        faceArray,//indices
        radius,
        detail=20,//more = smoother
        material,
        materialArgs,
        scene,
        rotation,
        onupdate=()=>{},
        oninit=()=>{}
    ){
        super(name, pos, vertexArray, faceArray, radius, detail, material, materialArgs, scene,oninit)
        this.rotation = new THREE.Quaternion(rotation.x,rotation.y,rotation.z,rotation.w);
        this.dx = 0;
        this.dy = 0;
        this.dz = 0;
        this.drx = 0;
        this.dry = 0;
        this.drz = 0;
        this.drw = 0;
        this.lifespan = 0;
        this.onUpdate = onupdate;
        this.update = (count) => {
            this.onUpdate();
            this.position.x+=this.dx;
            this.position.y+=this.dy;
            this.position.z+=this.dz;
            this.mesh.position.set(
                this.position.x,
                this.position.y,
                this.position.z
            );
            this.rotation.x+=this.drx;
            this.rotation.y+=this.dry;
            this.rotation.z+=this.drz;
            this.rotation.w+=this.drw;
            this.mesh.rotation.set(
                this.rotation.x,
                this.rotation.y,
                this.rotation.z
            );
            console.log(this.drx);
        }
    }
}