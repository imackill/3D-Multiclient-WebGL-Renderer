export class immovableLight{
    constructor(
        objName="Light",
        pos,
        color=0xffffff,
        intensity=1,
        //types are PointLight, SpotLight, DirectionalLight, HemisphereLight, AmbientLight, RectAreaLight
        type,
        scene,
        options={//mainly additional parameters for RectAreaLight and HemisphereLight
            ptLight:{distance:0,decay:2},
            spotLight:{distance:0,angle:Math.PI/4,penumbra:0,decay:2},
            hemisphereLight:{skyColor:0xffffff,groundColor:0xffffff},
            rectangleLight:{width:1,height:1}
        }
    ){
        this.objName = objName;
        this.pos = pos;
        this.color = color;
        this.intensity = intensity;
        this.type = type;
        this.options = options;
        this.initElement = () => {
            let light;
            switch (this.type) {
                case THREE.AmbientLight:
                    light = new this.type(this.color,this.intensity);
                    break;
                
                case THREE.PointLight:
                    light = new this.type(color, intensity, options.ptLight.distance, options.ptLight.decay);
                    break;

                case THREE.SpotLight:
                    light = new this.type(color,intensity,options.spotLight.distance,options.spotLight.angle,options.spotLight.penumbra,options.spotLight.decay);
                    break;

                case THREE.HemisphereLight:
                    light = new this.type(options.hemisphereLight.skyColor,options.hemisphereLight.groundColor,intensity);
                    break;

                case THREE.RectAreaLight:
                    light = new this.type(color,intensity,options.rectangleLight.width,options.rectangleLight.height);
                    break;

                default:
                    this.type = THREE.AmbientLight;
                    light = new this.type(this.color,this.intensity);
                    break;
            }
            light.position.set(this.pos.x,this.pos.y,this.pos.z);
            this.scene.add(light)
        }
    }
}