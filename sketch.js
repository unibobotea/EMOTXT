let letters = [];
let alphabet = "A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z";
let typedLetters = [];
let letterSpacing = 400;


let img;
let s5;
let a = 0;

let faceapi;
let detections = [];


let video;
let canvas;


// let xPos = -750;
// let yPos=-320;
// let zPos = 100;

let happiness = 200;
let sadness = 200;
let anger = 200;
let neu = 200;
let myFont;

let imgCache = {};

function preload() {
  myFont = loadFont('Rand-Regular.ttf');
  font1 = loadFont('OffBitTrial-101Bold.ttf');

  let alphabetLetters = alphabet.split(",");
  for (let i = 0; i < alphabetLetters.length; i++) {
    let fileName = "Letters/Letter" + alphabetLetters[i] + ".png";
    if (!imgCache[fileName]) {
      let img = loadImage(fileName);
      img.resize(500, 500);
      letters.push(img);
      imgCache[fileName] = img;
    } else {
      letters.push(imgCache[fileName]);
    }
  }
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight,WEBGL);
  textFont(myFont);
  canvas.id("canvas");
  img = letters[0];
  img.resize(500, 500);
  
  let videoSize = min(windowWidth, windowHeight) / 2.7; // Adjust size here

  video = createCapture(VIDEO);
  video.id("video");
  video.hide();

  // Add an event listener for the video's 'loadedmetadata' event
  video.elt.addEventListener('loadedmetadata', () => {
    // Calculate the width and height for the video to be displayed at while maintaining aspect ratio
    let aspectRatio = video.width / video.height;
    if(aspectRatio > 1) { // If width > height
      videoWidth = videoSize;
      videoHeight = videoSize / aspectRatio;
    } else {
      videoHeight = videoSize;
      videoWidth = videoSize * aspectRatio;
    }
    // Now resize the video element to these dimensions
    video.size(videoWidth, videoHeight);
  });

  cacheGraphics = createGraphics(videoSize, videoSize); // create cacheGraphics with the new size
  cacheGraphics.translate(videoSize / 2, videoSize / 2);

  const faceOptions = {
    withLandmarks: true,
    withExpressions: true,
    withDescriptors: true,
    minConfidence: 1
  };
  
  // Initialize the model
  faceapi = ml5.faceApi(video, faceOptions, faceReady);
}



function faceReady() {
  faceapi.detect(gotFaces);// Start detecting faces
}

// Got faces
function gotFaces(error, result) {
  if (error) {
    console.log(error);
    return;
    
  }

  detections = result;　//Now all the data in this detections
  // console.log(detections);

  clear();//Draw transparent background;: 
  // drawBoxs(detections);//Draw detection box:
  // drawLandmarks(detections);//// Draw all the face points: 
  drawExpressions(detections, 20, 250, 14);//Draw face expression: 


  faceapi.detect(gotFaces);// Call the function again at here: 
  
  // let emotion = "Happy";
  drawLetterForm();
  drawVideo();
  drawLine();
}

var mode = 1 


function drawVideo() {
  push();
  
  // change these values to reposition the video
  let videoXPosition = -590; 
  let videoYPosition = -200;
  let videoZPosition = 100;
  
  // change this value to scale the video
  let videoScale = 1;
  
  translate(videoXPosition, videoYPosition, videoZPosition);
  scale(videoScale);

  video.loadPixels();  // load the pixel data from the video

  let span = 5;
  
  for (let i = 0; i < video.width; i += span) {
    for (let o = 0; o < video.height; o += span) {
      let loc = (i + o * video.width) * 4;
      let r = video.pixels[loc];
      let g = video.pixels[loc + 1];
      let b = video.pixels[loc + 2];
      let bk = (r + g + b) / 3;

      if (mode == 1) {
        let shapeSize = span * map(bk, 0, 255, 0, 1);
        if (bk > 192) {
          fill('#ff0005');
          stroke(0);
          strokeWeight(0.3);
          triangle(i, o, i + span/2, o + span/2, i - span/2, o + span/2);
        } else if (bk > 128) {
          fill('#fdff00');
          ellipse(i, o, shapeSize);
        } else if (bk > 64) {
          fill('#23fd00');
          rect(i, o, shapeSize*1.5, shapeSize*1.5);
        } else {
          fill('#3202ff');
          square(i - shapeSize, o - shapeSize * 2, shapeSize * 2);
        }
      }
    }
  }

  // After the pixel manipulation, render the video to cacheGraphics
  cacheGraphics.image(video, 0, 0);
  
  pop();
}

function drawExpressions(detections, x, y, textYSpace){
  // background(0);  
  if(detections.length > 0){//If at least 1 face is detected: 
    let {neutral, happy, angry, sad} = detections[0].expressions;
     // textFont('Helvetica Neue');
    textSize(20);
    // noStroke();
    fill(0,0,220);
 
    
    happiness = happy;
    sadness = sad;
    anger = angry;
    neu = neutral;
    
    push();
        // Determine the highest value of the expressions
    let maxValue = Math.max(neutral, happy, angry, sad);

    // Display the corresponding emotion label based on the highest value
    
    textSize(36);
    
    if(maxValue === neutral) {
      text("NEUTRAL", x-350, y-470);
    }
    else if(maxValue === happy) {
      text("HAPPY", x-350, y-470);
    }
    else if(maxValue === angry) {
      text("ANGER", x-350, y-470);
    }
    else if(maxValue === sad) {
      text("SAD", x-350, y-470);
    }
    pop();
    text("NEUTRAL:       " + nf(neutral*100, 2, 2)+"%", x-350, y+10);
    text("HAPPINESS:   " + nf(happy*100, 2, 2)+"%", x-350, y+textYSpace+20);
    text("ANGER:        " + nf(angry*100, 2, 2)+"%", x-350, y+textYSpace*2+30);
    text("SADNESS:      "+ nf(sad*100, 2, 2)+"%", x-350, y+textYSpace*3+40);
    // text("disgusted: " + nf(disgusted*100, 2, 2)+"%", x, y+textYSpace*4);
    // text("surprised:  " + nf(surprised*100, 2, 2)+"%", x, y+textYSpace*5);
    // text("fear:           " + nf(fearful*100, 2, 2)+"%", x, y+textYSpace*6);
  }else{//If no faces is detected: 
    text("NEUTRAL:       ", x-350, y+10);
    text("HAPPINESS:   " , x-350, y + textYSpace+20);
    text("ANGER:        ", x-350, y + textYSpace*2+30);
    text("SADNESS:      ", x-350, y + textYSpace*3+40);
  //   text("disgusted: ", x, y + textYSpace*4);
  //   text("surprised: ", x, y + textYSpace*5);
  //   text("fear: ", x, y + textYSpace*6);
  }
}

function drawLetterForm() {
  
// background('#ff0005');
  // background('#23fd00');
  // 3D Image Visualization
  push();
  translate(-500, -550, -500)

  // rotateY(radians(mouseX * 0.5));
  console.log(mouseX)

  let x = 10;
  let y = height / 2 - 25;
  
  for (let i = 0; i < typedLetters.length; i++) {
    let letterIndex = typedLetters[i].charCodeAt(0) - 65;
    if (letters[letterIndex]) {
      push();
      translate(x, y - 100, -200);
      rotateY(radians(mouseX/2 * 0.08));
  
  let tiles = 15;
  // let tileSize = height/tiles;
       let tileSize = 38;
  

  // fill(0);
  // noStroke();

        let img = letters[letterIndex];
      img.resize(tileSize * tiles, tileSize * tiles);
      for (let row = 0; row < tiles; row++) {
        for (let col = 0; col < tiles; col++) {
          let c = img.get(floor(col * tileSize), floor(row * tileSize));
          let b = map(brightness(c), 0, 255, 0, 1);
          let z = map(b, 0, 1, -100, 100);
          push();
          translate(col * tileSize, row * tileSize, z);
          stroke(0);
      strokeWeight(0.5);
          
           //neutral
      fill('#23fd00');
      box(tileSize*b*neu*3,tileSize*b*neu*3,tileSize*b*neu*3);
       
          //happy
      fill('#fdff00');
      sphere(tileSize*b*3*happiness);
         
          
          //sadness
fill('#3202ff');
box(tileSize*b*0.5*sadness*3,tileSize*b*4*sadness*5,tileSize*b*0.05*sadness);
          
            //anger
fill('#fe3614'); 
rotateZ(radians(-90));
rotateX(radians(70));
cone(tileSize * b*anger, tileSize * b*37*anger);
          
          pop();
        }
      }
      
      x += tileSize + letterSpacing; 
      
      pop();
    }
  }
  pop();
}


function drawLine() {
  push();
  translate(-940,40,-300);
  textFont(font1);
  textSize(28);
  fill(0);
  text('EMOTION DETECTION', -90,20);
  pop();
}


function keyPressed() {
  if (keyCode === BACKSPACE) {
    typedLetters.pop();
  } else if (keyCode >= 65 && keyCode <= 90 && typedLetters.length < 4) {
    let letter = String.fromCharCode(keyCode);
    typedLetters.push(letter);
  } else {
    return false; // Prevent default behavior of key press
  }
}