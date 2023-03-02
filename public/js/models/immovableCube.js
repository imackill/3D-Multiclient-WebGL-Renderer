export class immovableCube{
    constructor(objName,
    pos,
    edgeLength,
    geometry,
    material,
    meshType,
    materialOptions,
    scene,
    rotation
    ){
        this.name = objName;
        this.pos = pos;
        this.edgeLength = edgeLength;
        this.geometry = geometry;
        this.material = material;
        this.meshType = meshType;
        this.materialOptions = materialOptions;
        this.scene = scene;
        this.sceneObject;
        this.rotation = rotation;
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
            this.sceneObject = cube;
            this.scene.add(cube);
        };
    };
}