const background = document.querySelector("canvas")
const context = background.getContext("2d")
const body = document.querySelector("body")

/* UTILS */
function randomNumber(min, max, floatPoints=0) {
  let number = min + Math.random() * max

  if(floatPoints == 0) return Math.trunc(number)
  return number.toPrecision(floatPoints + 1)
}

function getRandomPosition() {
  return {
    x: randomNumber(0, background.width),
    y: randomNumber(0, background.height)
  }
}

/* DRAW STARS */

function drawStar({x, y}) {

  let radius = randomNumber(0.2, 3.5, 2)

  let type = randomNumber(1, 10)

  context.beginPath()

  if(type > 4) { // Squared star
    context.rotate(45 * Math.PI / 180)
    context.rect(x, y, radius, radius)
  }else{
    context.arc(x, y, radius, 0, 2 * Math.PI)
  }
  
  context.globalAlpha = randomNumber(0.3, 1, 1)
  context.fillStyle = "#ffffff"
  context.fill()
  context.closePath()

}

function drawStars(amount) {

  context.fillStyle = "#000000"
  context.fillRect(0,0,background.width,background.height)

  for(let i = 0; i < amount; i++) {

    drawStar(getRandomPosition())

  }

}

/* INIT */

function updateCanvasSize() {

  background.width = window.innerWidth
  background.height = window.innerHeight * 4

}

function init() {

  updateCanvasSize()
  drawStars(3000)

}

init()