// python -m http.server
let Pa, Pb;
let segments = [];
let controls = [[87, 83, 65, 68], [38, 40, 37, 39]];
let drops = []
let PD = ["food", "sword", "shield"]

/*
*Collision matrix:
*if you hit them and you...
* ...have a sword and they don't have a shield, they die
* ...have a sword and they have a shield, you stop
* ...have a shield, you stop
* ...have nothing you die
* if you hit the edge you loop
* what happens if you hit yourself?
* 
*/
function setup() {
    createCanvas(windowWidth - 20, windowHeight - 20);
    background("#aabbcc");
    Pa = new head(20, 20, 20);
    Pb = new head(200, 200, 20);
}

/////////////////////////////////////////////////////////////////////////////

function draw() {
    background("#aabbcc");
    for(let i = 0; i < segments.length; i++){
        segments[i].step();
    }
    if(frameCount % 30 == 0){
        drops.push(new powerup())
    }
    for(let i = 0; i < drops.length; i++){
        drops[i].draw();
    }
    Pa.move();
    Pb.move();
}

/////////////////////////////////////////////////////////////////////////////

class body {
    constructor(x, y, time){
        this.death = frameCount + time;
        this.x = x;
        this.y = y;
        this.state = "none";
    }
    step(){
        if(frameCount < this.death){
            fill("#00FF00");
            noStroke();
            circle(this.x, this.y, 20);
        }
    }
    getPos(){
        return[this.x, this.y];
    }
}

/////////////////////////////////////////////////////////////////////////////
/*
function preload() {
  // Make sure the filename matches your PNG perfectly
  snake1head = loadImage('myImage.png'); 
}
*/
class head {
    constructor(x, y, time) {
        this.x = x;
        this.y = y;
        this.time = time;
        this.D = "";
    }
    move(){
        segments.push(new body(this.x, this.y, this.time));
        if(this.D == "up"){
            this.y -= 5;
        } else if(this.D == "down"){
            this.y += 5;
        } else if(this.D == "left"){
            this.x -= 5;
        } else if(this.D == "right"){
            this.x += 5;
        }
        fill("#3ac43a");
        if(this.state == "sword"){
            //give shield
        } else if(this.state == "shield"){
            //give sword
        }
        noStroke();
        circle(this.x, this.y, 20);
        this.collision();
    }
    turn(D){
        if(this.D != "down" && D == "up"){
            this.D = D;
        }
        if(this.D != "up" && D == "down"){
            this.D = D;
        }
        if(this.D != "left" && D == "right"){
            this.D = D;
        }
        if(this.D != "right" && D == "left"){
            this.D = D;
        }
    }
    collision(){
        if(this.x > width){
            this.x = 0;
            console.log("left");
        } else if(this.x < 0){
            this.x = width;
            console.log("right");
        } else if(this.y > height){
            this.y = 0;
            console.log("top");
        } else if(this.y < 0){
            this.y = height;
            console.log("bottom");
        }
        for(let i = 0; i < drops.length; i++){
            if(dist(drops[i].getPos()[0], drops[i].getPos()[1], this.x, this.y) <= 40){
                let gain = drops[i].consume();
                if(gain = "food"){
                    this.time += 5;
                } else if(gain = "sword" || gain == "shield"){
                    this.state = gain;
                }
            }
        }
        for(let i =0; i < segments.length; i++){
            if(dist(segments[i].getPos()[0], segments[i].getPos()[1], this.x, this.y) <= 40){
                this.kill();
            }
        }
    }
    kill(){
        //onsole.log("die")
    }
}

/////////////////////////////////////////////////////////////////////////////

function keyPressed(){
    if(keyCode == controls[0][0]){
        Pa.turn("up");
    } else if(keyCode == controls[0][2]){
        Pa.turn("left");
    } else if(keyCode == controls[0][1]){
        Pa.turn("down");
    } else if(keyCode == controls[0][3]){
        Pa.turn("right");
    } else if(keyCode == controls[1][0]){
        Pb.turn("up");
    } else if(keyCode == controls[1][2]){
        Pb.turn("left");
    } else if(keyCode == controls[1][1]){
        Pb.turn("down");
    } else if(keyCode == controls[1][3]){
        Pb.turn("right");
    }
}

class powerup{
    constructor(){
        this.x = random(0, width);
        this.y = random(0, height);
        this.type = PD[Math.floor(random(0, PD.length))];
    }
    draw(){
        if(this.type == "food"){
            fill("#c96c6c");//food
        } else if (this.type == "sword"){
            fill("#757575");//sword
        } else if(this.type == "shield"){
            fill("#855b00");//shield
        } else {
            return;//used
        }
        noStroke();
        circle(this.x, this.y, 20);
    }
    getPos(){
        if(this.type == "none"){
            return(-10000, -10000);
        }
        return[this.x, this.y];
    }
    consume(){
        let temp =  this.type;
        this.type = "none";
        return temp;
    }
}