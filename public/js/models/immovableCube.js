module.exports = function immovableCube(
    objName,
    pos,
    edgeLength,
    geometry,
    material,
    meshType,
    materialOptions,
    scene){
        this.name = objName;
        this.pos = pos;
        this.edgeLength = edgeLength;
        this.geometry = geometry;
        material = material;
        meshType = meshType;
        materialOptions = materialOptions;
        scene = scene;
        this.initElement = () => {
            let geo = new this.geometry(this.edgeLength,this.edgeLength,this.edgeLength);
            let mat = new this.material(this.materialOptions);
            let cube = new this.meshType(geo, mat);
            this.scene.add(cube);
        };
};

