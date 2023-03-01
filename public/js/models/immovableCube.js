export class immovableCube{
    constructor(objName,
    pos,
    edgeLength,
    geometry,
    material,
    meshType,
    materialOptions,
    scene
    ){
        this.name = objName;
        this.pos = pos;
        this.edgeLength = edgeLength;
        this.geometry = geometry;
        this.material = material;
        this.meshType = meshType;
        this.materialOptions = materialOptions;
        this.scene = scene;
        this.initElement = () => {
            let geo = new this.geometry(this.edgeLength,this.edgeLength,this.edgeLength);
            let mat = new this.material(this.materialOptions);
            let cube =  new this.meshType(geo, mat);
            this.scene.add(cube);
        };
    };
}