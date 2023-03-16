import * as THREE from 'three';
export class Plane {
    constructor(
    name,
    geo_args={width:1,height:1,wSegments:1,hSegments:1},
    material,
    material_args={color:0xf00f00,wireframe:false},
    position=new THREE.Vector3(0,0,0),
    rotation=new THREE.Quaternion(0,0,0,0),
    scene,
    oninit,
    onupdate,
    ){
        this.name = name;
        this.geo_args = geo_args;
        this.material = material;
        this.material_args = material_args;
        this.position = position;
        this.rotation = rotation;
        this.initElement = () => {
            oninit();
            this.geo = new THREE.PlaneGeometry(geo_args.width,geo_args.height,geo_args.wSegments,geo_args.hSegments);
            this.mesh = new THREE.Mesh(this.geo,new this.material(material_args));
            this.mesh.position.set(this.position.x,this.position.y,this.position.z);
            this.mesh.rotation.set(this.rotation.x,this.rotation.y,this.rotation.z);
            scene.add(this.mesh);
        }
        this.update = () => {
            onupdate();
        }
    }

}