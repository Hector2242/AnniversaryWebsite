// Initialize content div
document.addEventListener('DOMContentLoaded', function() {
    var dv = document.getElementById("content");
    if (dv) {
        dv.style.opacity = 1;  // Make content visible immediately
    }

    // Start timer immediately
    timer();
    setInterval(timer, 1000);
});

function timer() {
    var start = new Date(2022, 10, 27, 19, 40);
    var t = new Date() - start;
    var d = Math.floor(t / 1000 / 60 / 60 / 24);
    var h = Math.floor(t / 1000 / 60 / 60 % 24);
    if(h < 10) {
        h = "0" + h;
    }
    var m = Math.floor(t / 1000 / 60 % 60);
    if(m < 10) {
        m = "0" + m;
    }
    var s = Math.floor(t / 1000 % 60);
    if(s < 10) {
        s = "0" + s;
    }
    
    // Update timer elements
    document.getElementById("d").innerHTML = d;
    document.getElementById("h").innerHTML = h;
    document.getElementById("m").innerHTML = m;
    document.getElementById("s").innerHTML = s;
}