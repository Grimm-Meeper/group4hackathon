//python -m http.server
function setup() {
    createCanvas(windowWidth - 20, windowHeight - 20);
    background("#aabbcc");
}
let red, gree, blue
function draw() {
    red = random(0, 255);
    green = random(0, 255);
    blue = random(0, 255);
    fill(red, green, blue);
    nostroke();
    circle(mouseX, mouseY, random(1, 100))
}

class body {
    constructor(x, y, time){
        this.death = frameCount + time;
        this.x = x;
        this.y = y;
    }
    draw(){
        if(frameCount < this.death){
            fill("#00FF00");
            nostroke();
            circle(this.x, this.y, 10);
        }
    }
}

class head {
    constructor() {

    }
}