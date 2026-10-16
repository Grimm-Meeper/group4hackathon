// python -m http.server

/////////////////////////////////////////////////////////////////////////////

let Pa, Pb;
let segments = [];
let controls = [[87, 83, 65, 68], [38, 40, 37, 39]];
let drops = []
let PD = ["food", "sword", "shield"]
let snake1head, snake2head, snake1body, snake2body;
let backsize = 200
/////////////////////////////////////////////////////////////////////////////

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
    Pa = new head(20, 20, 20, "a");
    Pb = new head(200, 200, 20, "b");
}

/////////////////////////////////////////////////////////////////////////////

function preload() {
  // Make sure the filename matches your PNG perfectly
  snake1head = loadImage('snake1head32x.png');
  snake1body = loadImage('snake1body32x.png');

  snake2head = loadImage('snake2head32x.png'); 
  snake2body = loadImage('snake2body32x.png');  

  snakearena = loadImage('snakearena32x.png');

  snakefood = loadImage('snakefood32x.png');

  snakeshield = loadImage('snakeshield32x.png');
  snakesword = loadImage('snakesword32x.png');
}

/////////////////////////////////////////////////////////////////////////////

function draw() {
    background(30);
    for(let i = 0; i < segments.length; i++){
        segments[i].step();
    }
    if(frameCount % 60 == 0){
        drops.push(new powerup())
    }
    for(let i = 0; i < drops.length; i++){
        drops[i].draw();
    }
    Pa.move();
    Pb.move();
}

/////////////////////////////////////////////////////////////////////////////
/*
function spacedrop(){
    for(let i = 0; i <= width % backsize; i++) {
        for(let j = 0; j <= height % backsize; j++) {
            image(snakearena, i, j, backsize, backsize)
        }
    }
}
*/
/////////////////////////////////////////////////////////////////////////////
class body {
    constructor(x, y, time, team){
        this.death = frameCount + time;
        this.x = x;
        this.y = y;
        this.state = "none";
        this.kill = false
        if(team){
            this.image = snake1body
        } else {
            this.image = snake2body
        }
    }
    step(){
        if(frameCount < this.death){
            noStroke();
            image(this.image, this.x-10, this.y-10, 20, 20);
            this.collision();
        }
    }
    getPos(){
        return[this.x, this.y];
    }
    collision(){
        if(dist(Pa.getPos()[0], Pa.getPos()[1], this.x, this.y) <= 40){
            if(this.kill){
                console.log("kill A")
            }
        } else if(dist(Pb.getPos()[0], Pb.getPos()[1], this.x, this.y) <= 40){
            if(this.kill){
                console.log("kill B")
            }
        } else {
            this.kill = true
        }
    }
}

/////////////////////////////////////////////////////////////////////////////

class head {
    constructor(x, y, time, team) {
        this.x = x;
        this.y = y;
        this.time = time;
        this.D = "";
        this.team = (team == "a")
        if(team == "a"){
            this.image = snake1head
        } else {
            this.image = snake2head
        }
    }
    move(){
        segments.push(new body(this.x, this.y, this.time, this.team));
        if(this.D == "up"){
            this.y -= 5;
        } else if(this.D == "down"){
            this.y += 5;
        } else if(this.D == "left"){
            this.x -= 5;
        } else if(this.D == "right"){
            this.x += 5;
        }
        if(this.state == "sword"){
            //give shield
        } else if(this.state == "shield"){
            //give sword
        }
        noStroke();
        image(this.image, this.x-10, this.y-10, 20, 20); 
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
            //console.log("left");
        } else if(this.x < 0){
            this.x = width;
            //console.log("right");
        } else if(this.y > height){
            this.y = 0;
            //console.log("top");
        } else if(this.y < 0){
            this.y = height;
            //console.log("bottom");
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
    }
    kill(){
        //console.log("die")
    }
    getPos(){
        return[this.x, this.y];
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
        this.image
    }
    draw(){
        if(this.type == "food"){
            this.image = snakefood;//food
        } else if (this.type == "sword"){
            this.image = snakesword;//sword
        } else if(this.type == "shield"){
            this.image = snakeshield;//shield
        } else {
            return;//used
        }
        noStroke();
        image(this.image, this.x - 10, this.y - 10, 40, 40);
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