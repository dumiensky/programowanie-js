const canvas = document.querySelector('canvas');
const canvasContext = canvas.getContext('2d');

const inputCount = document.querySelector('#input-count');
const inputLength = document.querySelector('#input-line-length');

let circles, doStop;

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
}

function start(){
    doStop = false;
    populateCircles();
    draw();
}

function stop(){
    doStop = true;
}

function populateCircles() {
    circles = [];
    for (var i = 0; i < inputCount.value; i++) {
        var radius = parseInt(Math.random() * 30);
        var x = Math.random() * (canvas.width - radius * 2) + radius;
        var y = Math.random() * (canvas.height - radius * 2) + radius;
       circles.push(new Circle(x, y, radius));
   }
}

function draw() {

    if (doStop)
        return;

	requestAnimationFrame(draw);
	canvasContext.clearRect(0,0,innerWidth, innerHeight);

	for (var i = 0; i < circles.length; i++) {
		circles[i].update();
	}
}