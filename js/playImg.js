var btn = document.getElementById("heartTxt");
btn.style.opacity = 0;
var btnVal = 0;

// Create navigation buttons
const prevButton = document.createElement("button");
prevButton.innerHTML = "Previous";
prevButton.id = "prevButton"; // Add an ID for easier debugging and styling
prevButton.style.position = "fixed";
prevButton.style.left = "20px";
prevButton.style.bottom = "20px";
prevButton.style.zIndex = 1000;
prevButton.style.padding = "10px 20px";
prevButton.style.backgroundColor = "#333";
prevButton.style.color = "#fff";
prevButton.style.border = "none";
prevButton.style.borderRadius = "5px";
prevButton.style.cursor = "pointer";

const nextButton = document.createElement("button");
nextButton.innerHTML = "Next";
nextButton.id = "nextButton"; // Add an ID for easier debugging and styling
nextButton.style.position = "fixed";
nextButton.style.right = "20px";
nextButton.style.bottom = "20px";
nextButton.style.zIndex = 1000;
nextButton.style.padding = "10px 20px";
nextButton.style.backgroundColor = "#333";
nextButton.style.color = "#fff";
nextButton.style.border = "none";
nextButton.style.borderRadius = "5px";
nextButton.style.cursor = "pointer";

// Add buttons to the body
document.body.appendChild(prevButton);
document.body.appendChild(nextButton);

// Function to navigate images
function navigateImages(direction) {
    if (direction === "next" && imageIndex < imageArray.length - 1) {
        imageIndex++;
    } else if (direction === "prev" && imageIndex > 0) {
        imageIndex--;
    }
    showImage();
}

// Add event listeners to buttons
prevButton.addEventListener("click", () => navigateImages("prev"));
nextButton.addEventListener("click", () => navigateImages("next"));

// Debugging: Check if buttons were added
console.log("Buttons added:", prevButton, nextButton);


function showImage() {
    myImage.setAttribute("src", imageArray[imageIndex]);
    myTxt.innerHTML = txtArray[imageIndex];
}

function play() {
    if (t == 0) {
        // First click: hide type text and show images
        document.getElementById("typeDiv").style.opacity = 0;
        document.getElementById("imgTxt").style.opacity = 1;
        imageIndex = 0;
        showImage();
    } else {
        // Return to main page
        document.getElementById("typeDiv").style.opacity = 1;
        document.getElementById("imgTxt").style.opacity = 0;
        t = -1; // Reset t for next click
    }
    t++;
}

function buttonFadeIn() {
    if(btnVal < 1) {
        btnVal += 0.025;
        btn.style.opacity = btnVal;
    }
    else {
        clearInterval(buttonInterval);
        if(ok == 3) {
            ok += 1;
        }
    }
}

// Keyboard navigation
document.addEventListener('keydown', function(event) {
    if (document.getElementById("imgTxt").style.opacity == 1) {
        if (event.key === 'ArrowRight') {
            if (imageIndex < imageArray.length - 1) {
                imageIndex++;
                showImage();
            }
        } else if (event.key === 'ArrowLeft') {
            if (imageIndex > 0) {
                imageIndex--;
                showImage();
            }
        }
    }
});

function event() {
    document.getElementById("imgTxt").style.opacity = 0;
    setTimeout(function() {
        buttonInterval = setInterval(buttonFadeIn, 50);
    }, 1500);
}

var buttonInterval;
event();

// Initialize variables
var imageIndex = 0;
var t = 0;

