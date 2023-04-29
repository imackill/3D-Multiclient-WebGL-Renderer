export class immovableCube{
    constructor(objName,
    pos=new THREE.Vector3(0,0,0),
    edgeLength,
    geometry,
    material,
    meshType,
    materialOptions,
    group,
    rotation
    ){
        this.lifespan = 0;
        this.name = objName;
        this.pos = pos;
        this.edgeLength = edgeLength;
        this.geometry = geometry;
        this.material = material;
        this.meshType = meshType;
        this.materialOptions = materialOptions;
        this.group = group;
        this.groupObject;
        this.rotation = rotation;
        let cubeEvent = new CustomEvent("oncubeinit", {"detail":"when a new cube object is initialized"})
        this.initElement = () => {
            let geo = new this.geometry(this.edgeLength,this.edgeLength,this.edgeLength);
            let mat = new this.material(this.materialOptions);
            let cube =  new this.meshType(geo, mat);
            cube.position.x=this.pos.x
            cube.position.y=this.pos.y
            cube.position.z=this.pos.z
            cube.rotation.x = this.rotation.x;
            cube.rotation.y = this.rotation.y;
            cube.rotation.z = this.rotation.z;
            this.groupObject = cube;
            this.cube.name = this.name;
            this.group.add(cube);
            document.dispatchEvent(cubeEvent);
            setInterval(()=>this.lifespan+=1,1000);
        };
    };
}