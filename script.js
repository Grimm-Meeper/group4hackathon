                       // python -m http.server

/////////////////////////////////////////////////////////////////////////////

let Pa, Pb;
let segments = [];
let controls = [[87, 83, 65, 68], [38, 40, 37, 39]];
let drops = [];
let snake1head, snake2head, snake1body, snake2body;
let backsize = 200;

/////////////////////////////////////////////////////////////////////////////

/*
*Collision matrix:
*if you hit them and you...
* ...have a sword and they don't have a shield, they die
* ...have a sword and they have a shield, you stop
* ...have a shield, you stop
* ...have nothing you die
* if you hit the edge you loop
* if you hit yourself you die
* 
*/

function setup() {
    angleMode(DEGREES);
    createCanvas(windowWidth - 20, windowHeight - 20);
    background("#aabbcc");
    Pa = new head(20, 20, 20, "a");
    Pb = new head(200, 200, 20, "b");
}

/////////////////////////////////////////////////////////////////////////////

function preload() {
  // Make sure the filename matches your PNG perfectly

  snake1body = loadImage('snake1body32x.png');
  snake1bodyeating = loadImage('snake1bodyeating32x.png');
  
  snake2body = loadImage('snake2body32x.png');  
  snake2bodyeating = loadImage('snake2bodyeating32x.png');

  snake1headU = loadImage('snake1head-UP.png');
  snake1headD = loadImage('snake1head-DOWN.png');
  snake1headL = loadImage('snake1head-LEFT.png');
  snake1headR = loadImage('snake1head-RIGHT.png');
  
  snake2headU = loadImage('snake2head-UP.png');
  snake2headD = loadImage('snake2head-DOWN.png');
  snake2headL = loadImage('snake2head-LEFT.png');
  snake2headR = loadImage('snake2head-RIGHT.png');  

  snakearena = loadImage('snakearenaBIG4x.png');

  snakefood = loadImage('snakefood32x.png');
  
  snake1wins = loadImage('snake1wins4x.png');
  snake2wins = loadImage("snake2wins4x.png");
  
/*
  snakeshield = loadImage('snakeshield32x.png');
  snakesword = loadImage('snakesword32x.png');
  */
}

/////////////////////////////////////////////////////////////////////////////

function draw() {
    background(30);
    image(snakearena, 0, 0, 1000, 1000)
    image(snakearena, 1000, 0, 1000, 1000)
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

function gameOver(looser) {
    if (looser == "a") {
            image(snake2wins, 20, 20, 20, 20)
        } else {
            image(snake1wins, 20, 20, 20, 20)
        }
}

/////////////////////////////////////////////////////////////////////////////

class body {
    constructor(x, y, time, team){
        this.death = frameCount + time;
        this.x = x;
        this.y = y;
        this.state = "none";
        this.kill = false
        if(team == "a"){
            this.image = snake1body
        } else if (team == "b"){
            this.image = snake2body
        } else if (team == "ae") {
            this.image = snake1bodyeating
        } else if(team == "be") {
            this.image = snake2bodyeating
        } else {
            fuck();
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
        this.D = "down";
        this.team = team
        this.inc = 0
        this.image
        if(team == "a"){
            this.set = [snake1headU, snake1headD, snake1headL, snake1headR]
        } else {
            this.set = [snake2headU, snake2headD, snake2headL, snake2headR]
        }
    }
    move(){
        segments.push(new body(this.x, this.y, this.time, this.team + (this.inc > 0 ? "e": "")));
        this.inc -= 1
        if(this.D == "up"){
            this.y -= 5;
            this.image = set[1];
        } else if(this.D == "down"){
            this.y += 5;
            this.image = set[2];
        } else if(this.D == "left"){
            this.x -= 5;
            this.image = set[3];
        } else if(this.D == "right"){
            this.x += 5;
            this.image = set[4];
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
                drops[i].consume();
                this.time += 5;
                this.inc = 3
            }
        }
    }
    kill(){
        console.log("die");
        gameOver(this.team)
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
        this.type = "food";
        this.image
    }
    draw(){
        if(this.type != "food"){
            return
        }
        noStroke();
        image(snakefood, this.x - 10, this.y - 10, 40, 40);
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