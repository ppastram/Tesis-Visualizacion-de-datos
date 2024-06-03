let sueno;
let trabajo;
let fft;
let playing = false;
let currentSound = 'none';

let trabajoTimes = [3000, 2000, 4000, 1000, 5000, 3000, 2000]; // Define 7 values of time for trabajo in milliseconds
let suenoTimes = [8000, 6000, 7000, 5000, 9000, 4000, 8000]; // Define 7 values of time for sueno in milliseconds

function preload(){
    trabajo = loadSound('./trabajo.mp3');
    sueno = loadSound('./sueno.mp3');
}

function setup(){
    createCanvas(windowWidth, windowHeight);
    angleMode(DEGREES);
    fft = new p5.FFT();
}

function draw(){
    background(0);
    strokeWeight(5);
    if (currentSound === 'trabajo') {
        stroke('#D90416'); // Red when trabajo is playing
    } else if (currentSound === 'sueno') {
        stroke('#04B2D9'); // Blue when sueno is playing
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
    if (index < trabajoTimes.length) {
        currentSound = 'trabajo';
        trabajo.play();
        setTimeout(() => {
            trabajo.pause();
            currentSound = 'none';
            setTimeout(() => {
                currentSound = 'sueno';
                sueno.play();
                setTimeout(() => {
                    sueno.pause();
                    currentSound = 'none';
                    setTimeout(() => {
                        playNext(index + 1); // Play next pair of times
                    }, 1000); // Pause for 1 second between blue to red
                }, suenoTimes[index]);
            }, 1000); // Pause for 1 second between red to blue
        }, trabajoTimes[index]);
    } else {
        playing = false; // End of sequence
    }
}
