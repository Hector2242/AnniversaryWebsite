var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Heart shape drawing function
function drawHeart(x, y, size, opacity) {
    ctx.beginPath();
    ctx.moveTo(x, y + size * 0.3);
    ctx.bezierCurveTo(
        x, y, 
        x - size / 2, y, 
        x - size / 2, y + size * 0.3
    );
    ctx.bezierCurveTo(
        x - size / 2, y + size * 0.6, 
        x, y + size * 0.9, 
        x, y + size * 0.9
    );
    ctx.bezierCurveTo(
        x, y + size * 0.9, 
        x + size / 2, y + size * 0.6, 
        x + size / 2, y + size * 0.3
    );
    ctx.bezierCurveTo(
        x + size / 2, y, 
        x, y, 
        x, y + size * 0.3
    );
    ctx.closePath();
    
    ctx.fillStyle = `rgba(255, 182, 193, ${opacity})`; // Light pink hearts
    ctx.fill();
}

var hearts = [];
var maxHearts = 40;

// Initialize hearts
for (var i = 0; i < maxHearts; i++) {
    hearts.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 15 + 5,
        speedY: Math.random() * 0.5 + 0.1,
        opacity: Math.random() * 0.5 + 0.2,
        pulse: 0,
        pulseSpeed: (Math.random() * 2 + 1) / 100
    });
}

function animate() {
    // Create gradient background
    var gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#f3e6e8'); // Light beige
    gradient.addColorStop(0.5, '#d9d2e9'); // Light purple
    gradient.addColorStop(1, '#ffe4e1'); // Misty rose
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update and draw hearts
    hearts.forEach(heart => {
        // Move heart upward
        heart.y -= heart.speedY;
        
        // Pulse effect
        heart.pulse += heart.pulseSpeed;
        var scaleFactor = 1 + Math.sin(heart.pulse) * 0.1;
        var currentSize = heart.size * scaleFactor;
        
        // Draw heart
        drawHeart(heart.x, heart.y, currentSize, heart.opacity);
        
        // Reset heart if it goes off screen
        if (heart.y < -20) {
            heart.y = canvas.height + 20;
            heart.x = Math.random() * canvas.width;
        }
    });

    requestAnimationFrame(animate);
}

// Handle window resize
window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

animate();