import * as THREE from 'three';
export class immovableCube{
    constructor(objName,
    pos=new THREE.Vector3(0,0,0),
    size,
    geometry,
    material,
    meshType,
    materialOptions,
    group,
    rotation,
    options={
        edges:false,
        edgesColor:0x000000,
    }
    ){
        this.lifespan = 0;
        this.options = options;
        this.name = objName;
        this.pos = pos;
        this.size = size;
        this.geometry = geometry;
        this.material = material;
        this.meshType = meshType;
        this.materialOptions = materialOptions;
        this.group = group;
        this.groupObject;
        this.rotation = rotation;
        let cubeEvent = new CustomEvent("oncubeinit", {"detail":"when a new cube object is initialized"});
        this.initElement = () => {
            let geo = new this.geometry(this.size.x,this.size.y,this.size.z);
            let mat = new this.material(this.materialOptions);
            this.cube =  new this.meshType(geo, mat);
            this.cube.position.x=this.pos.x;
            this.cube.position.y=this.pos.y;
            this.cube.position.z=this.pos.z;
            this.cube.rotation.x = this.rotation.x;
            this.cube.rotation.y = this.rotation.y;
            this.cube.rotation.z = this.rotation.z;
            this.groupObject = this.cube;
            this.cube.name = this.name;
            this.group.add(this.groupObject);
            if(this.options.edges == true){
                let edges = new THREE.EdgesGeometry( geo );
                this.edgeObj = new THREE.LineSegments(edges, new THREE.LineBasicMaterial( { color: this.options.edgesColor } ) );
                this.edgeObj.material.linewidth = 2;
                this.edgeObj.position.set(
                    this.cube.position.x,
                    this.cube.position.y,
                    this.cube.position.z,
                );
                this.edgeObj.rotation.set(
                    this.cube.rotation.x,
                    this.cube.rotation.y,
                    this.cube.rotation.z,
                );
                this.group.add(this.edgeObj);
            }
            document.dispatchEvent(cubeEvent);
            setInterval(()=>this.lifespan+=1,1000);
        };
    };
}
