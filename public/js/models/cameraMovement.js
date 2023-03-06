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
        });
        this.rotation.x = rot.x;
        this.rotation.y = rot.y;
        this.rotation.z = rot.z;
    }
}