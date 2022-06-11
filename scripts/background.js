const background = document.querySelector("canvas#background")
const context = background.getContext("2d")

const body = document.body, html = document.documentElement

var WIDTH = window.innerWidth
var HEIGHT = Math.max( 
  body.scrollHeight, 
  body.offsetHeight, 
  html.clientHeight, 
  html.scrollHeight, 
  html.offsetHeight)

/* UTILS */
function randomNumber(min, max, floatPoints=0) {
  let number = min + Math.random() * max

  if(floatPoints == 0) return Math.trunc(number)
  return Number(number.toPrecision(floatPoints + 1))
}

function getRandomPosition() {
  return {
    x: randomNumber(0, background.width),
    y: randomNumber(0, background.height)
  }
}

/* DRAW STARS */

function drawStar({x, y}) {

  let radius = randomNumber(0.3,4, 2)
  let opacity = randomNumber(0.3, 1, 1)

  context.beginPath()
  context.rotate(45 * Math.PI / 180)
  context.rect(x-radius/2, y-radius/2, radius, radius)
  context.globalAlpha = opacity
  context.fillStyle = "#ffffff"
  context.fill()
  context.closePath()

  context.beginPath()
  context.arc(x, y, radius-(radius*0.45), 0, 2 * Math.PI)
  context.globalAlpha = opacity
  context.fillStyle = "#ffffff"
  context.fill()
  context.closePath()

}

function drawStars(amount) {

  context.fillStyle = "#000311"
  context.fillRect(0,0,background.width,background.height)

  for(let i = 0; i < amount; i++) {

    drawStar(getRandomPosition())

  }

}

/* INIT */

function updateCanvasSize(element) {

  element.width = WIDTH
  element.height = HEIGHT

}

function init() {

  updateCanvasSize(background)
  drawStars((WIDTH + HEIGHT) / 2)

}

init()

window.onresize = () => {
  WIDTH = window.innerWidth
  HEIGHT = Math.max( 
    body.scrollHeight, 
    body.offsetHeight, 
    html.clientHeight, 
    html.scrollHeight, 
    html.offsetHeight)

  updateCanvasSize(background)
  init()
}