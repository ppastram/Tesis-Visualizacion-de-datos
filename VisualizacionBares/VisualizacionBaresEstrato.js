let avgData;

function preload() {
    loadJSON('./baresOFiestas_por_estrato.json', (data) => {
        avgData = Array.isArray(data) ? data : Object.values(data);
    });
}

function setup() {
    createCanvas(1000, 900); // Adjust the size as needed
    colorMode(HSB, 255); // Use HSB color mode
    loadJSON("baresOFiestas_por_estrato.json", function(data) {
        avgData = data;
    });
    
    // Set the properties for the header
    textSize(24); // Larger text size for the header
    fill(0); // Black color for high contrast and visibility
    textAlign(CENTER, TOP); // Center align the text horizontally, top align vertically
}

function draw() {
    background(220); // Clear with a light gray background for visibility

    text("Estrato vs. BaresOFiestas", width / 2, 30); // Position at the top center

    if (Array.isArray(avgData)) {
        avgData.forEach((data, index) => {
            const startY = 100; // Starting Y position for the first oscillating line
            const gap = 120; // Gap between each line, increased if needed
            const centerY = startY + (index * gap);
            
            // Generate a unique color for each line
            const hue = map(data.estratoTarifa, 1, avgData.length, 0, 255);
            stroke(hue, 204, 100); // HSB color mode
            fill(hue, 204, 100, 127); // Optional, if you have shapes with fill

            const frequency = data.baresOFiestas; // Use baresOFiestas as frequency
            drawOscillatingLine(centerY, frequency, frameCount / 20); // Update phase with frameCount
            
            // Reset fill for text and set text color to black for visibility
            fill(0); // Black color for text
            noStroke(); // Disable stroke for text to make it cleaner
            textSize(16); // Set text size
            text(`Estrato Tarifa: ${data.estratoTarifa}`, 100, centerY - 10); // Display estratoTarifa above the line
        });
    }
}

function drawOscillatingLine(centerY, frequency, phase) {
    const lineLength = 400; // Length of the oscillating line
    const amplitude = 20; // Amplitude of oscillation
    const numPoints = 100; // Number of points to create smooth oscillation
    const startX = (width - lineLength) / 2; // Start X to center the line

    beginShape();
    for (let i = 0; i <= numPoints; i++) {
        const x = startX + (lineLength / numPoints) * i;
        const angle = map(i, 0, numPoints, 0, TWO_PI * frequency) + phase;
        const y = centerY + sin(angle) * amplitude;
        vertex(x, y);
    }
    endShape();
}

// Remember to re-enable loop if you want continuous animation
function mousePressed() {
    loop(); // Use this to start the animation on mouse click
}
