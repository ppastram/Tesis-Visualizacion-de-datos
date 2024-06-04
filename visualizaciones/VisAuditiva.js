let trabajo;
let fft;
let playing = false;
let currentSound = 'none';
let currentIndex = 0; // Track the current index in trabajoTimes
let configLoaded = false;

let trabajoTimes = []; // Initialize as an empty array
let config = {}; // Initialize config object
let yVariableFile = ''; // Store the filename for the yVariable

function preload(){
    customFont = loadFont('./SpaceMono-Regular.ttf');
    titulo = loadFont('./RubikMonoOne-Regular.ttf');
    bold = loadFont('./SpaceMono-Bold.ttf');

    config = loadJSON('../config.json', (data) => {
        console.log("Config loaded successfully:", data);
        // Populate trabajoTimes with "promedios" multiplied by 1000
        trabajoTimes = data.promedios.map(p => p * 1000);
        config = data;
        yVariableFile = `./${data.yVariable}.mp3`; // Set the filename based on yVariable
        trabajo = loadSound(yVariableFile, () => {
            console.log(`${yVariableFile} loaded successfully`);
            configLoaded = true; // Mark config as loaded only after the sound is loaded
        }, (error) => {
            console.error(`Error loading ${yVariableFile}:`, error);
        });
        console.log("trabajoTimes:", trabajoTimes);
        console.log("config:", config);
    }, (error) => {
        console.error("Error loading config.json:", error);
    });
}

function setup(){
    createCanvas(windowWidth, windowHeight);
    angleMode(DEGREES);
    fft = new p5.FFT();
    // Add event listener to resume AudioContext on user gesture
    getAudioContext().suspend();
    userStartAudio();
}

function draw(){
    background(0);
    strokeWeight(5);
    if (currentSound === 'trabajo') {
        stroke('#D90416'); // Red when trabajo is playing
    } else {
        stroke(255); // White when nothing is playing
    }

    noFill();
    translate(width / 2, height / 2);

    let wave = fft.waveform();
    let sensitivity = 2.0; // Increase this value to make the waveforms more sensitive

    for (let t = -1; t <= 1; t += 2) {
        beginShape();
        for (let i = 0; i <= 180; i++) {
            let index = floor(map(i, 0, 180, 0, wave.length - 1));

            let r = map(wave[index] * sensitivity, -1, 1, 150, 350);

            let x = r * sin(i) * t;
            let y = r * cos(i);
            vertex(x, y);
        }
        endShape();
    }

    // Check if config is loaded before displaying the title
    if (configLoaded) {
        console.log("Displaying titles");
        fill(242, 242, 242);
        noStroke();
        textFont(titulo);
        textSize(40);
        textAlign(CENTER, CENTER);
        if (playing && currentIndex < config.grupos.length) {
            text(`${config.grupos[currentIndex]}`, 0, 0);
        }
        text(`Tiempo dedicado a ${config.yVariable.replaceAll('-', ' ')}`, 0, -500);
        text(`Haga click para oír la visualización`, 0, 500);
    } else {
        fill(255, 0, 0);
        textFont('Arial');
        text("Loading config...", width / 2, height / 2);
    }
}

function mouseClicked() {
    if (!playing) {
        playing = true;
        playSequence();
    }
}

function playSequence() {
    playNext(0);
}

function playNext(index) {
    currentIndex = index; // Update the current index
    if (index < trabajoTimes.length) {
        currentSound = 'trabajo';
        trabajo.play();
        setTimeout(() => {
            trabajo.pause();
            currentSound = 'none';
            setTimeout(() => {
                playNext(index + 1); // Play next time
            }, 1000); // Pause for 1 second between plays
        }, trabajoTimes[index]);
    } else {
        playing = false; // End of sequence
    }
}
