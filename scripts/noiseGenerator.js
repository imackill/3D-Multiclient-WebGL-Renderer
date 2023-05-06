class pnoiseGenerator {
    constructor(
        xValue=int,
        yValue=int,
        options={
            heightMax:10,
            heightMin:1,
        }
        ){
            this.xValue = xValue;
            this.yValue = yValue;
            this.heightMax = options.heightMax;
            this.heightMin = options.heightMin;
            this.cellnumber = xValue*yValue;
            this.peakFactor = 1/(this.heightMax+this.heightMin);
            this.peaknumber = Math.floor(this.peakFactor*this.cellnumber);
            this.basenumber = this.peaknumber;
    }
    createPerlinNoiseMap(){
        let generatorx = this.xValue;
        let generatory = this.yValue;
        function GeneratePair(target,placeholder,final){
            let coords = [Math.floor(Math.random()*generatorx),Math.floor(Math.random()*generatory)];
            if(final[coords[1]][coords[0]]==placeholder){
                target.push(coords);
                return coords;
            }else{
                GeneratePair(target,placeholder,final);
            }
        }
        let BlankBitNoiseArray = [];
        for(let row = 0; row < this.yValue; row++){
            let temparr = [];
            for(let cell = 0; cell < this.xValue; cell++){
                temparr[cell] = 0;
            }
            BlankBitNoiseArray.push(temparr);
        }
        let BitNoiseArray = BlankBitNoiseArray;
        let peakcoords = [];
        for (let peak = 0; peak < this.peaknumber; peak++) {
            GeneratePair(peakcoords,0,BitNoiseArray,this.xValue,this.yValue);
        }
        peakcoords.forEach(coord => {
            BitNoiseArray[coord[1]][coord[0]] = this.heightMax;
        });
        //BitNoiseArray now has peak values
        let basecoords = [];
        for (let base = 0; base < this.basenumber; base++){
            GeneratePair(basecoords,0,BitNoiseArray,this.xValue,this.yValue);
        }
        basecoords.forEach(coord => {
            BitNoiseArray[coord[1]][coord[0]] = this.heightMin;
        });
        let PerlinNoiseArray = BitNoiseArray;
        for(let y = 0; y < this.yValue; y++){
            for(let x = 0; x < this.xValue; x++){
                if(BitNoiseArray[y][x]==0){ // not a peak cell
                    let lowercell,uppercell,leftcell,rightcell;
                    //calculate nonedge cells
                    if(y != 0 && y!= this.yValue-1 && x!= 0 && x != this.xValue-1){
                        lowercell = BitNoiseArray[y+1][x];
                        uppercell = BitNoiseArray[y-1][x];
                        leftcell = BitNoiseArray[y][x-1];
                        rightcell = BitNoiseArray[y][x+1];
                        let cellavg = (lowercell+uppercell+leftcell+rightcell)/4;
                        if(cellavg > 0){
                            PerlinNoiseArray[y][x] = cellavg;
                        }else{
                            PerlinNoiseArray[y][x] = (this.heightMax+this.heightMin)/2;
                        }
                    }
                    //calculate top edge without corners
                    if(y==0 && y != this.yValue-1 && x != 0 && x != this.xValue-1){
                        lowercell = BitNoiseArray[y+1][x];
                        uppercell = null;
                        leftcell = BitNoiseArray[y][x-1];
                        rightcell = BitNoiseArray[y][x+1];
                        let cellavg = (lowercell+leftcell+rightcell)/3;
                        if(cellavg > 0){
                            PerlinNoiseArray[y][x] = cellavg;
                        }else{
                            PerlinNoiseArray[y][x] = (this.heightMax+this.heightMin)/2;
                        }
                    }
                    //calculate y bottom edge without corners
                    if(y!=0 && y == this.yValue-1 && x != 0 && x != this.xValue-1){
                        lowercell = null
                        uppercell = BitNoiseArray[y-1][x];
                        leftcell = BitNoiseArray[y][x-1];
                        rightcell = BitNoiseArray[y][x+1];
                        let cellavg = (uppercell+leftcell+rightcell)/3;
                        if(cellavg > 0){
                            PerlinNoiseArray[y][x] = cellavg;
                        }else{
                            PerlinNoiseArray[y][x] = (this.heightMax+this.heightMin)/2;
                        }
                    }
                    //calculate x left edge without corners
                    if(y != 0 && y!= this.yValue-1 && x == 0 && x != this.xValue-1){
                        lowercell = BitNoiseArray[y+1][x];
                        uppercell = BitNoiseArray[y-1][x];
                        leftcell = null;
                        rightcell = BitNoiseArray[y][x+1];
                        let cellavg = (lowercell+uppercell+rightcell)/3;
                        if(cellavg > 0){
                            PerlinNoiseArray[y][x] = cellavg;
                        }else{
                            PerlinNoiseArray[y][x] = (this.heightMax+this.heightMin)/2;
                        }
                    }
                    //calculate x right edge without corners
                    if(y != 0 && y!= this.yValue-1 && x!= 0 && x == this.xValue-1){
                        lowercell = BitNoiseArray[y+1][x];
                        uppercell = BitNoiseArray[y-1][x];
                        leftcell = BitNoiseArray[y][x-1];
                        rightcell = null;
                        let cellavg = (lowercell+uppercell+leftcell)/3;
                        if(cellavg > 0){
                            PerlinNoiseArray[y][x] = cellavg;
                        }else{
                            PerlinNoiseArray[y][x] = (this.heightMax+this.heightMin)/2;
                        }
                    }
                    //calculate top left corner
                    if(y==0 && x==0){
                        lowercell = BitNoiseArray[y+1][x];
                        uppercell = null
                        leftcell = null;
                        rightcell = BitNoiseArray[y][x+1];
                        let cellavg = (lowercell+rightcell)/2;
                        if(cellavg > 0){
                            PerlinNoiseArray[y][x] = cellavg;
                        }else{
                            PerlinNoiseArray[y][x] = (this.heightMax+this.heightMin)/2;
                        }
                    }
                    //calculate bottom left
                    if(y==this.yValue-1 && x==0){
                        lowercell = null;
                        uppercell = BitNoiseArray[y-1][x];
                        leftcell = null;
                        rightcell = BitNoiseArray[y][x+1];
                        let cellavg = (uppercell+rightcell)/2;
                        if(cellavg > 0){
                            PerlinNoiseArray[y][x] = cellavg;
                        }else{
                            PerlinNoiseArray[y][x] = (this.heightMax+this.heightMin)/2;
                        }
                    }
                    //calculate top right
                    if(y==0 && x==this.xValue-1){
                        lowercell = BitNoiseArray[y+1][x];
                        uppercell = null;
                        leftcell = BitNoiseArray[y][x-1];
                        rightcell = null;
                        let cellavg = (lowercell+leftcell)/2;
                        if(cellavg > 0){
                            PerlinNoiseArray[y][x] = cellavg;
                        }else{
                            PerlinNoiseArray[y][x] = (this.heightMax+this.heightMin)/2;
                        }
                    }
                    //calculate bottom right
                    if(y==this.yValue-1 && x==this.xValue-1){
                        lowercell = null;
                        uppercell = BitNoiseArray[y-1][x];
                        leftcell = BitNoiseArray[y][x-1];
                        rightcell = null;
                        let cellavg = (uppercell+leftcell)/2;
                        if(cellavg > 0){
                            PerlinNoiseArray[y][x] = cellavg;
                        }else{
                            PerlinNoiseArray[y][x] = (this.heightMax+this.heightMin)/2;
                        }
                    }
                }
            }
        }
        return PerlinNoiseArray;
    }
}
