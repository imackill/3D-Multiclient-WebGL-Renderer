import * as THREE from 'three';
export class KeyboardPerspectiveCamera extends THREE.PerspectiveCamera{
    constructor(
        fov,
        aspect,
        near,
        far,
        scene,
        pos,
        rot,
    ){
        super(fov,aspect,near,far);
        this.scene = scene;
        this.mouse = {origin:{x:0,y:0,z:0},pos:{x:0,y:0,dx:0,dy:0}};
        document.addEventListener("keypress", (event) => {
            switch (event.key) {
                case "w":
                    this.position.z-=1;
                    break;
                case "a":
                    this.position.x-=1;
                    break;
                case "s":
                    this.position.z+=1;
                    break;
                case "d":
                    this.position.x+=1;
                    break;
            
                default:
                    console.log(event);
                    break;
            }
        });
        this.position.x = pos.x;
        this.position.y = pos.y;
        this.position.z = pos.z;

        document.addEventListener("mousemove", (event) => {
            console.log(`(${event.clientX},${event.clientY})`);
            this.mouse.pos.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.pos.y = (event.clientY / window.innerHeight) * 2 - 1;
            this.mouse.pos.dx = this.mouse.origin.x - this.mouse.pos.x;
            this.mouse.pos.dt = this.mouse.origin.t; - this.mouse.pos.y;
        });
        this.rotation.x = rot.x += this.mouse.pos.dx / 100;
        this.rotation.y = rot.y += this.mouse.pos.dy / 100;
        this.rotation.z = rot.z;
    }
}