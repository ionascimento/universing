const body = document.querySelector("body");
var pageLoaded = false;

async function waitForPageLoad() {
  return new Promise((resolve, reject) => {
    if(pageLoaded) resolve()
    window.onload = () => { pageLoaded = true; resolve() }
  })
}

function fixCanvasSize(canvas) {
  canvas.width = body.clientWidth
  canvas.height = body.clientHeight
}

function drawStar(context, {
  x, y, radius, opacity
}) {
  // Circle
  context.beginPath();
  context.arc(x, y, radius*0.53, 0, Math.PI*2);
  context.globalAlpha = opacity / 2;
  context.fillStyle = "#ffffff";
  context.fill();
  context.closePath();

  // Square
  context.save();
  
  context.translate(x, y);
  context.rotate(45 * Math.PI / 180);

  context.globalAlpha = opacity;
  context.fillStyle = "#ffffff";
  context.fillRect(-radius/2, -radius/2, radius, radius);

  context.restore();
}

function drawStars(canvas, amount) {
  let context = canvas.getContext("2d");
  for(let i = 0; i < amount; i++) {
    drawStar(context, {
      x: randomNumber(0, canvas.width, 4),
      y: randomNumber(0, canvas.height, 4),
      opacity: randomNumber(0.2, 1, 4),
      radius: randomNumber(1, 3, 4)
    })
  }
}

async function initializeBackground(canvas) {
  await waitForPageLoad();
  fixCanvasSize(canvas);
}

function getDefaultStarsAmount(canvas) {
  return (canvas.width + canvas.height) / 2.5;
}

function autoFixOnResize(canvas, starsAmount) {
  window.onresize = () => {
    fixCanvasSize(canvas);
    drawStars(canvas, starsAmount || getDefaultStarsAmount(canvas));
  }
}

function fadeInEffect(canvas) {
  canvas.style.opacity = 1;
}

async function startStarBackground(canvasSelector, starsAmount) {
  let canvas = document.querySelector(canvasSelector);
  await initializeBackground(canvas);
  
  drawStars(canvas, starsAmount || getDefaultStarsAmount(canvas));
  autoFixOnResize(canvas, starsAmount);

  fadeInEffect(canvas);
}

function fixSizeOnLoop(canvas) {
  canvas.height = body.clientHeight;
  if(canvas.width != body.clientWidth) canvas.width = body.clientWidth;
}

var comets = [];

function createComet({x, y, radius, opacity}) {
  comets.push({
    x, y, radius, opacity,
    lines: []
  })
}

function drawLines(context, lines) {
  context.beginPath();
  for(let line of lines) {
    context.lineTo(line.x, line.y);
  }
  context.strokeStyle = "#fff";
  context.lineWidth = 1.5;
  context.stroke();
  context.closePath();
}

function drawComet(context, comet) {
  drawStar(context, comet);
  drawLines(context, comet.lines);
}

function updateComet(comet) {
  comet.x += 1;
  comet.y += 1;

  comet.lines.push({x: comet.x, y: comet.y});
  if(comet.lines.length > comet.radius * 15) comet.lines.shift();
}

function generateRandomComet(canvas) {

  let XorY = randomNumber(1, 10);

  let x = randomNumber(0, canvas.width / 1.5, 4);
  let y = 0;

  if(XorY <= 5) {
    x = 0;
    y = randomNumber(0, canvas.height / 1.5, 4);
  } 

  createComet({
    x,
    y,
    opacity: randomNumber(0.3, 1, 4),
    radius: randomNumber(1, 3, 4)
  })
}

function checkCometValidity(canvas, comet) {
  if(comet.lines[0].x > canvas.width 
  || comet.lines[0].y > canvas.height) {
    comets.splice(comets.indexOf(comet), 1);
  }
}

function loop(canvas, context) {

  fixSizeOnLoop(canvas);

  for(let comet of comets) {
    updateComet(comet);
    drawComet(context, comet);
    checkCometValidity(canvas, comet);
  }

  requestAnimationFrame(() => { loop(canvas, context) });
}

async function startCometBackground(canvasSelector) {
  let canvas = document.querySelector(canvasSelector);
  await initializeBackground(canvas);

  let context = canvas.getContext("2d");

  setInterval(() => {
    if(document.hasFocus()) generateRandomComet(canvas);
  }, 7000)

  loop(canvas, context);
}