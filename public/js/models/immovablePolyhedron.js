import * as THREE from "three";

export class immovablePolyhedron {
    constructor(
        name,
        pos=new THREE.Vector3(0,0,0),
        vertexArray,//array of {x:,y:,z:} objects (points)
        faceArray,//same as verticies, with more poitns than vertices
        radius,
        detail=20,//more = smoother
        material,
        materialArgs,
        group,
        oninit=()=>{}
    ){
        this.group = group;
        this.name = name;
        this.position = new THREE.Vector3(pos.x,pos.y,pos.z);
        this.radius = radius;
        this.detail = detail;
        this.mat_args = materialArgs;
        this.mat = new material(this.mat_args);
        this.vertices = [];
        this.faces = [];
        this.mesh = null;
        this.frame = null;
        this.oninit = oninit;
        vertexArray.forEach(elem => {
            this.vertices.push(elem.x);
            this.vertices.push(elem.y);
            this.vertices.push(elem.z);
        });
        faceArray.forEach(elem => {
            this.faces.push(elem.x);
            this.faces.push(elem.y);
            this.faces.push(elem.z);
        });
        this.initElement =  () => {
            try{
                this.geometry = new THREE.PolyhedronGeometry(this.vertices, this.faces, this.radius, this.detail);
                let polymesh = new THREE.Mesh(this.geometry, this.mat);
                polymesh.position.set(this.position.x,this.position.y,this.position.z);
                this.mesh = polymesh;
                this.mesh.name = this.name;
                this.group.add(polymesh);
                this.oninit();
            }catch(e){
                console.error(e)
            }
            
        };
        this.update = (frameUpdate) => {
            this.frame = frameUpdate;
        }
    }
}