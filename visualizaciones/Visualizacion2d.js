let sectors = [];
let currentSector = 0;
let currentCircle = 0;
let fullTurns = 1; // Start with 1 for better understanding and control

function preload() {
  customFont = loadFont('./SpaceMono-Regular.ttf');
  titulo = loadFont('./RubikMonoOne-Regular.ttf');
  bold = loadFont('./SpaceMono-Bold.ttf');  // Adjust the path as necessary
}

function setup() {
  createCanvas(1920, 1080); // Updated size of the canvas
  background(13,13,13); // Set the background color of the canvas
  // Define sectors and how many circles each should have
  sectors = [
    { minAngle: 240, maxAngle: 300, numBlue: 4, numYellow: 1 },
    { minAngle: 300, maxAngle: 360, numBlue: 4, numYellow: 1 },
    { minAngle: 0, maxAngle: 60, numBlue: 4, numYellow: 2 },
    { minAngle: 60, maxAngle: 120, numBlue: 4, numYellow: 3 },
    { minAngle: 120, maxAngle: 180, numBlue: 4, numYellow: 4 },
    { minAngle: 180, maxAngle: 240, numBlue: 4, numYellow: 5 }
  ];
  textSize(40);
   // Increased text size for better visibility on larger screens

  drawStaticElements(); 
}

function draw() {
  // Adjust frameDelay based on the number of full turns
  if (fullTurns <= 2) {
    frameDelay = 20; // Keep it constant for a slower start
  } else {
    frameDelay = Math.max(0.5, frameDelay-5); // Faster decrease using a divisor that grows exponentially
  }

  // Animation logic; only run if below 365 cycles
  if (fullTurns <= 364) {
    if (frameCount % frameDelay === 0) {
      let sector = sectors[currentSector];
      drawCircleInSector(sector.minAngle, sector.maxAngle, sector.numBlue, sector.numYellow);
    }


    // Clear the area for the counter and update the display
    fill(13,13,13);
    noStroke();
    rect(width - 330, height - 100, 320, 80); // Adjusted for new canvas size
    fill(242,242,242);
    textFont(titulo); 
    textSize(80);
    text(`Día:${fullTurns}`, width - 550, height - 40); // Positioned in the bottom right corner
  }
}

function drawCircleInSector(minAngle, maxAngle, numBlue, numYellow) {
  let totalCircles = numBlue + numYellow;
  if (currentCircle < totalCircles) {
    let radius = random(20, 450); // Adjusted for larger main circle
    let angleOffset = asin(20 / radius) * (180 / PI);
    let angle = radians(random(minAngle + angleOffset, maxAngle - angleOffset));

    let x = 960 + radius * cos(angle); // Centered on new canvas width
    let y = 540 + radius * sin(angle); // Centered on new canvas height

    if (currentCircle < numBlue) {
      fill(4, 178, 217);
    } else {
      fill(217, 4, 22);
    }
    circle(x, y, 10); // Slightly larger circles for better visibility
    currentCircle++;
  } else {
    currentCircle = 0;
    if (currentSector === sectors.length - 1) { // Check if it's the last sector
      fullTurns++; // Increment full turns count
    }
    currentSector = (currentSector + 1) % sectors.length; // Loop through sectors
  }

  
}

function drawStaticElements() {
  let outerRadius = 500;  // Radius at which titles will be placed, slightly more than your circle radius
  noFill();
  stroke(184, 176, 217);
  strokeWeight(2);
  circle(960, 540, 900);

  for (let angle = 0; angle < 360; angle += 60) {
    let x = 960 + 450 * cos(radians(angle));
    let y = 540 + 450 * sin(radians(angle));
    line(960, 540, x, y);
  }

  // Draw the titles for each sector
  const titles = ["Estrato 1", "Estrato 2", "Estrato 3", "Estrato 4", "Estrato 5", "Estrato 6"];
  textSize(24); // Adjust text size as needed
  fill(242,242,242);  // Text color
  noStroke();
  
  sectors.forEach((sector, index) => {
    let midAngle = radians((sector.minAngle + sector.maxAngle) / 2);
    let textX = 960 + outerRadius * cos(midAngle);
    let textY = 540 + outerRadius * sin(midAngle);
    push();
    translate(textX, textY);
    rotate(midAngle + PI / 2); // Adjust rotation if needed to make text upright
    textAlign(CENTER, CENTER);
    textFont(bold); 
    text(titles[index], 0, -20);  // Offset y position to move text slightly outside the line
    pop();
  });

  // Draw the main title
  noStroke();
  fill(242,242,242); // Black color for the title text
  textSize(120); 
  textFont(titulo); // Title text size
  text("Ocio", 18, 125);
  textSize(35); // Subtitle text sizes
  textFont(customFont); 
  text("Tiempo dedicado a oir música", 20, 170);
  text("y a leer por estrato", 25, 210);

  text("5 minutos oyendo música", 25, 980);
  fill(4, 178, 217);
  circle(550 , 967, 40); 
  fill(242,242,242);
  text("5 minutos leyendo", 25, 1050);
  fill(217, 4, 22);
  circle(420 , 1037, 40); 
  fill(0);
}
