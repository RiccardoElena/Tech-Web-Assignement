'use strict';

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  plus(point) {
    return new Point(this.x + point.x, this.y + point.y);
  }

  equals(point) {
    return this.x === point.x && this.y === point.y;
  }

  midPoint(point) {
    return new Point((this.x + point.x) / 2, (this.y + point.y) / 2);
  }
}

const randomNumber = (up = 1, low = 0) => {
  return Math.floor(Math.random() * (up - low) + low);
};

class Triangle {
  constructor(points) {
    if (points.length > 3 || points.length <= 0) throw new Error();
    this.vertices = points;
  }

  getRandomVertex() {
    return this.vertices[randomNumber(3)];
  }
}

const startButton = document.getElementById('start');

const canvas = document.getElementById('triangle');
const ctx = canvas.getContext('2d');
const triangle = new Triangle([
  new Point(300, 100),
  new Point(100, 500),
  new Point(500, 500),
]);

const ITERATIONS = 50000;
let intervalId;

startButton.addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  clearInterval(intervalId);
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  const midColor = Math.random();
  const randomHexColor = () =>
    `#${Math.floor(Math.random() * 0x1000000)
      .toString(16)
      .padStart(6, '0')}`;

  const color1 = randomHexColor();
  const color2 = randomHexColor();
  const color3 = randomHexColor();

  gradient.addColorStop(0, color1);
  gradient.addColorStop(midColor, color2);
  gradient.addColorStop(1, color3);
  ctx.fillStyle = gradient;

  let randomPoint = new Point(randomNumber(600), randomNumber(600));
  let i = 0;
  intervalId = setInterval(() => {
    if (i >= ITERATIONS) {
      clearInterval(intervalId);
    }
    const midPoint = randomPoint.midPoint(triangle.getRandomVertex());
    ctx.fillRect(midPoint.x, midPoint.y, 1, 1);
    randomPoint = midPoint;
    i++;
  });
});
