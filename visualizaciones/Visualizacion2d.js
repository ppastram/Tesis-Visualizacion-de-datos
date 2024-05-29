let sectors = [];
let currentSector = 0;
let currentCircle = 0;
let fullTurns = 1; // Start with 1 for better understanding and control
let currentBlueCircle = 0;
let currentYellowCircle = 0;
let isAnimating = false;
let audioContextStarted = false;
let leerSound, musicaSounds = [];
let musicaIndex = 0;


function preload() {
 customFont = loadFont('./SpaceMono-Regular.ttf');
 titulo = loadFont('./RubikMonoOne-Regular.ttf');
 bold = loadFont('./SpaceMono-Bold.ttf');  // Adjust the path as necessary
 leerSound = loadSound('leer.mp3');  // Load the leer sound
 // Load the música sounds
 musicaSounds.push(loadSound('musica1.wav'));
 musicaSounds.push(loadSound('musica2.wav'));
 musicaSounds.push(loadSound('musica3.wav'));
 musicaSounds.push(loadSound('musica4.wav'));
 musicaSounds.push(loadSound('musica5.wav'));
}


function setup() {
 createCanvas(2250, 1080);
 background(13, 13, 13);
 textSize(40);
 let angles = [0]; // Start with an initial angle of 0
 let percentages = [21, 32, 29, 11, 4, 3]; // Percentages for each sector
 let blueCircles = [4, 4, 4, 4, 4, 4]; // Number of blue circles per sector
 let yellowCircles = [1, 1, 2, 3, 4, 5]; // Number of yellow circles per sector


 // Calculate cumulative angles in radians
 for (let i = 0; i < percentages.length; i++) {
   let lastAngle = angles[angles.length - 1];
   let newAngle = lastAngle + (percentages[i] * 3.6); // Convert percentage to angle
   angles.push(newAngle);
 }


 // Define sectors with calculated angles and specific numbers of circles
 sectors = percentages.map((p, index) => ({
   minAngle: radians(angles[index]),
   maxAngle: radians(angles[index + 1]),
   numBlue: blueCircles[index],
   numYellow: yellowCircles[index]
 }));


 // Randomize the order of the música sounds initially
 shuffleArray(musicaSounds);


 drawStaticElements();
 noLoop();
}


function mousePressed() {
 if (!audioContextStarted) {
   // Attempt to resume the AudioContext on the first interaction
   getAudioContext().resume().then(() => {
     console.log('AudioContext resumed successfully!');
     audioContextStarted = true;
   });
 }


 // Toggle the animation state
 if (!isAnimating) {
   loop(); // Start the animation
 } else {
   noLoop(); // Pause the animation
 }
 isAnimating = !isAnimating;
}


function draw() {
 let frameDelay = 1; // Adjust this delay based on your animation speed requirements
 // Continue the animation logic if below 365 cycles
 if (fullTurns <= 364) {
   if (frameCount % frameDelay === 0) {
     let sector = sectors[currentSector];
     let totalCirclesInSector = sector.numBlue + sector.numYellow;
     let circles = [];


     // Create a list of alternating colors based on the number required for each color
     for (let i = 0; i < sector.numBlue; i++) {
       circles.push('blue');
     }
     for (let i = 0; i < sector.numYellow; i++) {
       circles.push('yellow');
     }


     // Shuffle the list of colors to get a random order
     shuffleArray(circles);


     if (currentCircle < totalCirclesInSector) {
       let color = circles[currentCircle];
       if (color === 'blue') {
         drawCircleInSector(sector.minAngle, sector.maxAngle, true, currentBlueCircle);
         currentBlueCircle++;
       } else {
         drawCircleInSector(sector.minAngle, sector.maxAngle, false, currentYellowCircle);
         currentYellowCircle++;
       }
       currentCircle++;
     }


     // Check if all circles in the current sector are drawn
     if (currentCircle >= totalCirclesInSector) {
       // Play the sound based on the majority of circles
       if (sector.numBlue > sector.numYellow) {
         playSoundForDuration(musicaSounds[musicaIndex], 0.5);
         musicaIndex = (musicaIndex + 1) % musicaSounds.length;
       } else {
         playSoundForDuration(leerSound, 0.5);
       }


       currentSector = (currentSector + 1) % sectors.length;
       currentBlueCircle = 0;
       currentYellowCircle = 0;
       currentCircle = 0;


       // Increment fullTurns only when all sectors have been processed
       if (currentSector === 0) {
         fullTurns++;
         // Randomize the order of the música sounds after a full turn is completed
         shuffleArray(musicaSounds);
       }
     }
   }


   // Update the display for the counter
   fill(13, 13, 13);
   noStroke();
   rect(width - 330, height - 100, 320, 80);
   fill(242, 242, 242);
   textFont(titulo);
   textSize(80);
   text(`Día:${fullTurns}`, width - 550, height - 40);
 }


 if (fullTurns % 50 === 0) {
   displaySpecialMessage(fullTurns);
 }
}


function playSoundForDuration(sound, duration) {
 sound.playMode('restart');
 sound.play();
 setTimeout(() => {
   sound.stop();
 }, duration * 1000);
}






function shuffleArray(array) {
 for (let i = array.length - 1; i > 0; i--) {
   const j = Math.floor(Math.random() * (i + 1));
   [array[i], array[j]] = [array[j], array[i]];
 }
}


function drawCircleInSector(minAngle, maxAngle, isBlue, circleIndex) {
 let centerX = 1340;
 let centerY = 540;
 let maxRadius = 450;
 let radiusIncrement = maxRadius / 364;
 let currentRadius = radiusIncrement * fullTurns;


 // Define the angular margin to prevent circles from overlapping sector boundaries
 let angularMargin = radians(2);  // 2-degree margin on each side


 // Adjusted min and max angles with margin
 let adjustedMinAngle = minAngle + angularMargin;
 let adjustedMaxAngle = maxAngle - angularMargin;


 let numCircles = isBlue ? sectors[currentSector].numBlue : sectors[currentSector].numYellow;
 let color = isBlue ? [4, 178, 217] : [217, 4, 22]; // Blue or Yellow


 let angleMin = adjustedMinAngle + (adjustedMaxAngle - adjustedMinAngle) * circleIndex / numCircles;
 let angleMax = adjustedMinAngle + (adjustedMaxAngle - adjustedMinAngle) * (circleIndex + 1) / numCircles;
 let angle = random(angleMin, angleMax); // Randomize angle within the segment


 let x = centerX + currentRadius * cos(angle);
 let y = centerY + currentRadius * sin(angle);
 fill(color);
 noStroke();
 circle(x, y, 10); // Draw circle with a fixed size
}
function drawStaticElements() {
 let outerRadius = 500; // Radius where titles will be placed
 noFill();
 stroke(184, 176, 217);
 strokeWeight(2);
 circle(1340, 540, 900);


 const titles = ["Estrato 1", "Estrato 2", "Estrato 3", "Estrato 4", "Estrato 5", "Estrato 6"];
 textSize(17);
 fill(242, 242, 242);


 sectors.forEach((sector, index) => {
   let startAngle = sector.minAngle;
   let endAngle = sector.maxAngle;
   let midAngle = (sector.minAngle + sector.maxAngle) / 2;


   let startX = 1340 + 450 * cos(startAngle);
   let startY = 540 + 450 * sin(startAngle);
   let endX = 1340 + 450 * cos(endAngle);
   let endY = 540 + 450 * sin(endAngle);


   // Draw lines from center to the start and end of each sector
   line(1340, 540, startX, startY);
   line(1340, 540, endX, endY);


   // Draw titles for each sector
   let textX = 1340 + outerRadius * cos(midAngle);
   let textY = 540 + outerRadius * sin(midAngle);
   push();
   translate(textX, textY);
   rotate(midAngle + PI / 2); // Adjust rotation to make text upright
   textAlign(CENTER, CENTER);
   textFont(bold);
   text(titles[index], 0, -20);
   pop();
 });


 // Optional: Draw main and subtitle texts
 noStroke();
 fill(242, 242, 242);
 textSize(120);
 textFont(titulo);
 text("Ocio", 38, 125);
 textSize(35);
 textFont(customFont);
 text("5 minutos oyendo música", 90, 980);
 fill(4, 178, 217);
 circle(60, 967, 40);
 fill(242, 242, 242);
 text("5 minutos leyendo", 90, 1050);
 fill(217, 4, 22);
 circle(60, 1037, 40);
}


function displaySpecialMessage(turnCount) {
 fill(242, 242, 242); // Set the text color
 textSize(25); // Set the text size
 noStroke();
 if (turnCount == 50) {
   textFont(titulo);
   let message = `Estrato 1:`;
   text(message, 40, 200);
   textFont(customFont);
   message = `21% de la población`;
   text(message, 40, 225);
   message = `10,134,238 personas`;
   text(message, 40, 250);
 }


 if (turnCount == 100) {
   textFont(titulo);
   let message = `Estrato 2:`;
   text(message, 40, 340);
   textFont(customFont);
   message = `32% de la población`;
   text(message, 40, 365);
   message = `15,442,718 personas`;
   text(message, 40, 390);
 }   // Adjust to appear below the subtitles


 if (turnCount == 150) {
   textFont(titulo);
   let message = `Estrato 3:`;
   text(message, 40, 480);
   textFont(customFont);
   message = `29% de la población`;
   text(message, 40, 505);
   message = `13,994,963 personas`;
   text(message, 40, 530);
 }


 if (turnCount == 200) {
   textFont(titulo);
   let message = `Estrato 4:`;
   text(message, 40, 620);
   textFont(customFont);
   message = `11% de la población`;
   text(message, 40, 645);
   message = `5,308,434 personas`;
   text(message, 40, 670);
 }
 if (turnCount == 250) {
   textFont(titulo);
   let message = `Estrato 5 y 6:`;
   text(message, 40, 760);
   textFont(customFont);
   message = `7% de la población`;
   text(message, 40, 785);
   message = `3,378,094 personas`;
   text(message, 40, 810);
 }


 if (turnCount == 300) {
   textFont(bold);
   let message = `Población Colombiana: 48,258,494`;
   text(message, 40, 915);
 }


 if (turnCount == 350) {
   textFont(customFont);
   message = `51,378,956 días oyendo música al año`;
   text(message, 40, 275);
   message = `12,843,739 días leyendo al año`;
   text(message, 40, 300);
   message = `78,286,000 días oyendo música al año`;
   text(message, 40, 415);
   message = `19,571,500 días leyendo al año`;
   text(message, 40, 440);
   message = `70,946,687 días oyendo música al año`;
   text(message, 40, 555);
   message = `35,473,343 días leyendo al año`;
   text(message, 40, 580);
   message = `26,910,811 días oyendo música al año`;
   text(message, 40, 695);
   message = `20,183,108 días leyendo al año`;
   text(message, 40, 720);
   message = `17,125,059 días oyendo música al año`;
   text(message, 40, 835);
   message = `19,265,692 días leyendo al año`;
   text(message, 40, 860);
 }
}



