let hh, clap, bass; //hihat source object
let hPat, cPat, bPat; //hihat pattern, array for setting beats
let hPhrase, cPhrase, bPhrase; //hihat phrase, defines how pattern is interpreted
let drums; //attach phrase, serves to transport phrase
let beatLength, cellWidth;
let canvas;
let sPat; //sequence pattern for drawing head
let cursorPos;

function setup() {
  canvas = createCanvas(320, 60);
  canvas.mousePressed(canvasPressed); //attach listener for canvas
  cursorPos = 0;

  //load each sound
  hh = loadSound("assets/hh_sample.mp3", () => {});
  clap = loadSound("assets/clap_sample.mp3", () => {});
  bass = loadSound("assets/bass_sample.mp3", () => {});

  //set beat for each instrument
  hPat = new Array(16).fill(0);
  cPat = new Array(16).fill(0);
  bPat = new Array(16).fill(0);
  sPat = Array.from(Array(16), (_, i) => i + 1); //array of sequential integers

  //set phrase interpretations according to patterns
  hPhrase = new p5.Phrase(
    "hh",
    (time) => {
      hh.play(time);
    },
    hPat
  );

  cPhrase = new p5.Phrase(
    "clap",
    (time) => {
      clap.play(time);
    },
    cPat
  );

  bPhrase = new p5.Phrase(
    "bass",
    (time) => {
      bass.play(time);
    },
    bPat
  );

  drums = new p5.Part(); //new drum object

  //tie drums to hihat, clap, and bass phrases
  drums.addPhrase(hPhrase);
  drums.addPhrase(cPhrase);
  drums.addPhrase(bPhrase);
  drums.addPhrase("seq", sequence, sPat); //for the play marker

  bpmCTRL = createSlider(10, 160, 30, 1); //bpm control
  bpmCTRL.position(10, 70);
  bpmCTRL.input(() => {
    drums.setBPM(bpmCTRL.value());
  });
  drums.setBPM("30");

  drawMatrix();
}

//make spacebar the play/pause
function keyPressed() {
  if (key === " ") {
    if (hh.isLoaded() && clap.isLoaded() && bass.isLoaded) {
      if (!drums.isPlaying) {
        drums.loop();
      } else {
        drums.stop();
      }
    } else {
      console.log("drums still loading");
    }
  }
}

// call drawPlayhead and drawMatrix at the same time to erase old playheads
function sequence(time, beatIndex) {
  setTimeout(() => {
    drawMatrix();
    drawPlayhead(beatIndex);
  }, time * 1000);
}

//play marker to show what is currently being played
function drawPlayhead(beatIndex) {
  stroke("red");
  fill(255, 0, 0, 30); //last value sets alpha
  rect((beatIndex - 1) * cellWidth, 0, cellWidth, height); //first two values set position of top left corner, next two are width and height
}

//adjust beat arrays based on canvas clicks
function canvasPressed() {
  let rowClicked = Math.ceil((3 * mouseY) / height);
  let indexClicked = Math.floor((16 * mouseX) / width);

  if (rowClicked === 1) {
    hPat[indexClicked] = hPat[indexClicked] ? 0 : 1;
  }

  if (rowClicked === 2) {
    cPat[indexClicked] = cPat[indexClicked] ? 0 : 1;
  }

  if (rowClicked === 3) {
    bPat[indexClicked] = bPat[indexClicked] ? 0 : 1;
  }
  drawMatrix();
}

//drawing matrix and elipses for musical score
function drawMatrix() {
  background(80);
  fill("white");
  stroke("gray");
  strokeWeight(2);
  beatLength = 16;
  cellWidth = width / beatLength;

  //horizontal lines
  for (let i = 0; i < beatLength + 1; i++) {
    line(i * cellWidth, 0, i * cellWidth, height);
  }

  //vertical lines
  for (let i = 0; i < 4; i++) {
    line(0, (i * height) / 3, width, (i * height) / 3);
  }

  // noStroke();

  for (let i = 0; i < beatLength; i++) {
    if (hPat[i] === 1) {
      ellipse(i * cellWidth + 0.5 * cellWidth, height / 6, 10);
    }
    if (cPat[i] === 1) {
      ellipse(i * cellWidth + 0.5 * cellWidth, height / 2, 10);
    }
    if (bPat[i] === 1) {
      ellipse(i * cellWidth + 0.5 * cellWidth, (height * 5) / 6, 10);
    }
  }
}
