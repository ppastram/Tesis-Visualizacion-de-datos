let sectors = [];
let currentSector = 0;
let currentCircle = 0;
let fullTurns = 1; // Start with 1 for better understanding and control
let currentBlueCircle = 0;
let currentYellowCircle = 0;
let isAnimating = false;


function preload() {
 customFont = loadFont('./SpaceMono-Regular.ttf');
 titulo = loadFont('./RubikMonoOne-Regular.ttf');
 bold = loadFont('./SpaceMono-Bold.ttf');  // Adjust the path as necessary
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

 drawStaticElements();
 noLoop();
}


function mousePressed() {
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
 


       currentSector = (currentSector + 1) % sectors.length;
       currentBlueCircle = 0;
       currentYellowCircle = 0;
       currentCircle = 0;


       // Increment fullTurns only when all sectors have been processed
       if (currentSector === 0) {
         fullTurns++;
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
