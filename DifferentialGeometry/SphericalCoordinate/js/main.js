const radius = 100;
const PI = Math.PI;
const cos = Math.cos;
const sin = Math.sin;
const config = {
    "ratio":{
        "x": 0.5,
        "y": 1.0
    },
    "mode": null,
    "fonts":{},
    "canvas": null,
    "DOM": {
        "S1": null, 
        "S2": null,
        "animate": null,
        "outline": null
    },
    "value": {}
}

document.addEventListener("DOMContentLoaded",()=>{
    Object.keys(config.DOM).forEach((key)=>{
        config.DOM[key] = document.getElementById(key);
        config.value[key] = config.DOM[key]? config.DOM[key].checked : null;
        if(config.DOM[key]){
            config.DOM[key].addEventListener("click",()=>{
                config.value[key] = config.DOM[key].checked;
            });
        }
    });
    const macro = {
        "\\R": "\\mathbb{R}",
        "\\u": "\\mathcal{U}",
    };
    [...document.getElementsByClassName("latex")].forEach((element)=>{
        katex.render(element.textContent, element, {
            throwOnError: false,
            displayMode: false,
            macro: macro
        });
    });
    [...document.getElementsByClassName("Latex")].forEach((element)=>{
        katex.render(element.textContent, element, {
            throwOnError: false,
            displayMode: true,
            macro: macro
        });
    });

    if(document.body.classList.value.includes("light-mode")){
        config.mode = "light-mode"; 
    }else{
        config.mode = "dark-mode"; 
    }
})


function windowResized() {
    if(windowWidth<470){
        config.ratio.x = 1.0;
        config.ratio.y = 0.5;
    }else{
        config.ratio.x = 0.5;
        config.ratio.y = 1.0;
    }
    resizeCanvas(
        windowWidth * config.ratio.x, 
        windowHeight * config.ratio.y
    );
    camera(0, -150, 500, 0, 0, 0, 0, 1, 0);
}

function preload() {
    config.fonts["Italic"] = loadFont('css/fonts/KaTeX_Main-Italic.ttf');
}

function setup() {
    frameRate(60);

    // RWD
    if(windowWidth<470){
        config.ratio.x = 1.0;
        config.ratio.y = 0.5;
    }


    config.canvas = createCanvas(
        windowWidth*config.ratio.x, 
        windowHeight*config.ratio.y,
        WEBGL);
    camera(0, -150, 500, 0, 0, 0, 0, 1, 0);
    noStroke()
    colorMode(RGB, 255, 255, 255, 1);

    config.canvas.mousePressed(()=>{
        config.canvas.elt.style.cursor = "grabbing";
    });
    config.canvas.mouseReleased(()=>{
        config.canvas.elt.style.cursor = "grab";
    });
    textFont(config.fonts["Italic"]);
    textSize(30);
    textAlign(CENTER, CENTER);
}

/* ---------------------------------------------------- */

function linspace(startValue, stopValue, cardinality) {
    var arr = [];
    var step = (stopValue - startValue) / (cardinality - 1);
    for (var i = 0; i < cardinality; i++) {
        arr.push(startValue + (step * i));
    }
    return arr;
}

const theta = linspace(0, PI, 25);
var animateTheta = PI/4;

function axis(length){
    strokeWeight(1);
    // axis line
    stroke(190,100,100);
    fill(190,100,100);
    line(0, length, 0, 
         0, 0, 0);
    text('x', 0, length, 0);

    stroke(100,100,190);
    fill(100,100,190);
    line(0, 0, 0,  
         length, 0, 0);
    text('y', length, 0, 0);

    stroke(100,190,100);
    fill(100,190,100);
    line(0, 0, 0, 
         0, 0, length);

    translate(0, 0, length);
    text('z', 0, 0);
    translate(0, 0, -length);
}

function mouseHover(){
    const left = config.canvas.elt.clientLeft;
    const right = config.canvas.elt.clientWidth + left;
    const top = config.canvas.elt.clientTop;
    const bottom = config.canvas.elt.clientHeight + top;

    return (
        winMouseX >= left &&
        winMouseY >= top &&
        winMouseX <= right &&
        winMouseY <= bottom
    );
}

function draw() {
    // background color
    if(config.mode=="light-mode"){
        background(200);
    }else{
        background(0);
    }

    if(mouseHover()){
        orbitControl(2,2, 0.3);
    }else{
        orbitControl(2,2, 0.0);
    }
    
    rotateX(HALF_PI);
    // better look
    rotateZ(animateTheta);
    if(config.value.animate){
        animateTheta += deltaTime/1000;
    }

    // axis
    axis(2*radius);

    // light setting
    specularColor(226, 210, 210);
    ambientLight(150);
    pointLight(155, 155, 155, 2*radius*cos(animateTheta), -2*radius, 2*radius*sin(animateTheta));

    // sphere
    strokeWeight(0.2);
    noStroke();
    if(config.value.outline){
        if(config.value.S1||config.value.S2){
            if(config.mode=="light-mode"){
                stroke(255);
            }else{
                stroke(0);
            }
        }else{
            if(config.mode=="light-mode"){
                stroke(0);
            }else{
                stroke(255);
            }
            
        }
    }

    rotateX(HALF_PI);
    if(config.value.S1&&config.value.S2){
        ambientMaterial(200, 100, 200);
    }else if(config.value.S1){
        ambientMaterial(200, 100, 100);
    }else if(config.value.S2){
        ambientMaterial(100, 100, 200);
    }else{
        noFill();
        ambientLight(0);
    }
    sphere(radius, 24, 24);
    rotateX(-HALF_PI);

    // line 
    strokeWeight(2);
    for(var i=0; i<theta.length-1; i++){
        const theta0 = theta[i] - HALF_PI;
        const theta1 = theta[i+1] - HALF_PI;

        stroke(255, 0, 0);
        if(config.value.S1){
            line(0, (radius) * cos(theta0), (radius) * sin(theta0),
                 0, (radius) * cos(theta1), (radius) * sin(theta1)
            );
        }

        stroke(0, 0, 255);
         if(config.value.S2){
            line((radius) * sin(theta0), -(radius) * cos(theta0), 0,
                 (radius) * sin(theta1), -(radius) * cos(theta1), 0
            );
        }
    }
}


