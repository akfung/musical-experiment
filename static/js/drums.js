let hh; //hihat source object
let hPat; //hihat pattern, array for setting beats
let hPhrase; //hihat phrase, defines how pattern is interpreted
let drums; //attach phrase, serves to transport phrase

function setup() {
  createCanvas(400, 400);
  hh = loadSound("assets/hh_sample.mp3", () => {
    drums.loop();
  });
  hPat = [1, 1, 1, 0]; //hPat for beats

  //set phrase interpretation hPhrase to pattern hPat
  hPhrase = new p5.Phrase(
    "hh",
    (time) => {
      hh.play(time);
      console.log(time);
    },
    hPat
  );

  drums = new p5.Part(); //new drum object

  drums.addPhrase(hPhrase); //tie drums to phrase
}

function draw() {
  background(220);
}
