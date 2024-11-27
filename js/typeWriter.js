// Text content for typing animation
const texts = {
    title1: "My Dearest Kaylee",
    title2: "Happy Anniversary, My Love",
    together: "We've been in love for"
};

// Initialize variables
let currentIndex = 0;
let currentText = '';
let isTyping = false;
let typeInterval = null;

// Function to type text into an element
function typeText(elementId, text, callback) {
    const element = document.getElementById(elementId);
    let index = 0;
    
    element.textContent = ''; // Clear existing text
    
    const typing = setInterval(() => {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
        } else {
            clearInterval(typing);
            if (callback) callback();
        }
    }, 100); // Typing speed - lower number = faster
}

// Function to initialize timer display
function initializeTimer() {
    const timerElement = document.getElementById('timer');
    if (timerElement) {
        timerElement.innerHTML = `
            <span id="d">0</span> Days 
            <span id="h">00</span> Hours 
            <span id="m">00</span> Minutes 
            <span id="s">00</span> Seconds
        `;
    }
}

// Function to update timer
function updateTimer() {
    const start = new Date(2022, 10, 27, 19, 40); // November 27, 2022, 19:40
    const now = new Date();
    const timeDiff = now - start;

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    document.getElementById('d').textContent = days;
    document.getElementById('h').textContent = hours.toString().padStart(2, '0');
    document.getElementById('m').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('s').textContent = seconds.toString().padStart(2, '0');
}

// Start the animation sequence
function startAnimations() {
    // First type the first title
    typeText('txt1', texts.title1, () => {
        // After first title, type the second title
        setTimeout(() => {
            typeText('txt2', texts.title2, () => {
                // After second title, show and type the "together" text
                const togetherElement = document.getElementById('together');
                if (togetherElement) {
                    togetherElement.style.opacity = '1';
                    typeText('together', texts.together, () => {
                        // After "together" text, show and start the timer
                        const contentElement = document.getElementById('content');
                        const timerElement = document.getElementById('timer');
                        if (contentElement && timerElement) {
                            contentElement.style.opacity = '1';
                            timerElement.style.opacity = '1';
                            initializeTimer();
                            updateTimer();
                            // Start timer updates
                            setInterval(updateTimer, 1000);
                        }
                    });
                }
            });
        }, 500); // Delay between first and second title
    });
}

// Initialize when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Reset all text content
    document.getElementById('txt1').textContent = '';
    document.getElementById('txt2').textContent = '';
    document.getElementById('together').textContent = '';
    
    // Set initial opacity
    document.getElementById('content').style.opacity = '0';
    document.getElementById('timer').style.opacity = '0';
    document.getElementById('together').style.opacity = '0';
    
    // Start the animation sequence
    setTimeout(startAnimations, 1000); // Small delay before starting
});

// Make timer update available globally
window.updateTimer = updateTimer;