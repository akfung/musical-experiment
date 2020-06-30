//initialize vars
let mrNoisy, playButton, stopButton, chooseNoise, setVolume, toggleOnOff, fft;

function setup() {
  //object background
  var canvas = createCanvas(400, 200);
  canvas.parent("music-container");
  // canvas.position(0, "getfucked", "getfucked");

  //create new noise generator
  mrNoisy = new p5.Noise();
  //set initial amplitude
  mrNoisy.amp(0);

  //fast fourier transform for waveform visualization
  fft = new p5.FFT();

  //play button toggles depending on if music is playing
  toggleOnOff = createButton("play")
    .parent("music-container")
    .position(10, 10, "relative")
    .style("font-family", "courier")
    .class("music-start");
  //event listener on mouse press
  toggleOnOff.mousePressed(() => {
    if (mrNoisy.started) {
      mrNoisy.stop();
      toggleOnOff.html("play");
    } else {
      mrNoisy.start();
      toggleOnOff.html("stop");
    }
  });

  //noise selection dropdown
  chooseNoise = createSelect();
  chooseNoise.position(60, 10, "relative").parent("music-container"); //set location
  chooseNoise.option("white");
  chooseNoise.option("pink");
  chooseNoise.option("brown");
  //listener to change noise generator with setType method
  chooseNoise.changed(() => {
    mrNoisy.setType(chooseNoise.value());
    fill(chooseNoise.value()); //set waveform fill to noise color
  });

  //create volume slider
  setVolume = createSlider(-60, 0, -60, 1);
  setVolume.position(130, 10, "relative").parent("music-container");
  // use .input listener for changing volume
  setVolume.input(() => {
    //volume slider is logarithmic
    mrNoisy.amp(pow(10, setVolume.value() / 20), 0.01);
  });

  //set the color of the waveform to white
  fill("white");
  noStroke();
}

//draw visualizer
function draw() {
  background(80);
  let spectrum = fft.analyze(); //assign fft array output to spectrum variable

  //beginShape and endShape use vertex defined points
  beginShape();
  vertex(0, height);
  //loop through all frequencies
  for (let i = 0; i < spectrum.length - 1; i++) {
    vertex(
      map(log(i), 0, log(spectrum.length), 0, width),
      map(spectrum[i], 0, 255, height, 0)
    );
  }
  vertex(width, height);
  endShape();
}

//new audio context on load
window.onload = function () {
  let context = new AudioContext(); //define new audio context
  //set play music button to resume audio context
  document.querySelector(".play-button").addEventListener("click", function () {
    context.resume().then(() => {
      console.log("Playback resumed successfully");
    });
  });
};

//listener to get audio started
