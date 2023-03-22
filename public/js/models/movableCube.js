import { immovableCube } from "./manifest.js";
export class movableCube extends immovableCube{
    constructor(
        objName,
        pos=new THREE.Vector3(0,0,0),
        edgeLength,
        geometry,
        material,
        meshType,
        materialOptions,
        group,
        rotation,
        onupdate=(options={})=>{},
        oninit=(options={})=>{}
    ){
        super(objName,pos,edgeLength,geometry,material,meshType,materialOptions,group,rotation);
        this.dx = 0;
        this.dy = 0;
        this.dz = 0;
        this.drx = 0;
        this.dry = 0;
        this.drz = 0;
        this.lifespan = 0;
        this.onUpdate = onupdate;
        this.oninit = oninit;
        document.addEventListener("oncubeinit", ()=>{oninit()});
        this.update = (count) => {
            this.onUpdate();
            this.pos.x+=this.dx;
            this.pos.y+=this.dy;
            this.pos.z+=this.dz;
            this.groupObject.position.set(
                this.pos.x,
                this.pos.y,
                this.pos.z
            );
            this.rotation.x+=this.drx;
            this.rotation.y+=this.dry;
            this.rotation.z+=this.drz;
            this.groupObject.rotation.set(
                this.rotation.x,
                this.rotation.y,
                this.rotation.z,
            );
        }
    }
}