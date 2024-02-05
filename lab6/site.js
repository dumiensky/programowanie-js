const canvas = document.querySelector('canvas');
const canvasContext = canvas.getContext('2d');

const inputCount = document.querySelector('#input-count');
const inputLength = document.querySelector('#input-line-length');

let circles, doStop, lineLength;

class Circle {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.dx = Math.random() > 0.5 ? 1 : -1;
        this.dy = Math.random() > 0.5 ? 1 : -1;
        this.radius = radius;
        this.speed = 10 / radius;
    }

    draw() {
        canvasContext.beginPath();
        canvasContext.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        canvasContext.fill();
    }

    update() {
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.dx = -this.dx;
        }

        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.dy = -this.dy;
        }

        this.x += this.speed * this.dx;
        this.y += this.speed * this.dy;

        this.draw();
    }

    distanceTo(other) {
        return Math.sqrt((Math.pow(other.x - this.x, 2)) + (Math.pow(other.y - this.y, 2)))
    }
}

function start() {
    stop();
    lineLength = inputLength.value;
    populateCircles();
    
    setTimeout(() => {
        doStop = false;
        draw();
    }, 100);
}

function stop() {
    doStop = true;
}

function populateCircles() {
    circles = [];
    for (var i = 0; i < inputCount.value; i++) {
        var radius = parseInt(Math.random() * 15) + 5;
        var x = Math.random() * (canvas.width - radius * 2) + radius;
        var y = Math.random() * (canvas.height - radius * 2) + radius;
        circles.push(new Circle(x, y, radius));
    }
}

function draw() {

    if (doStop)
        return;

    requestAnimationFrame(draw);
    canvasContext.clearRect(0, 0, innerWidth, innerHeight);

    for (let i = 0; i < circles.length; i++) {
        circles[i].update();

        for (let j = 0; j < circles.length; j++) {
            let distance = circles[i].distanceTo(circles[j]);

            if (distance < lineLength) {
                canvasContext.beginPath();
                canvasContext.moveTo(circles[i].x, circles[i].y);
                canvasContext.lineTo(circles[j].x, circles[j].y);
                canvasContext.stroke();
            }
        }
    }
}