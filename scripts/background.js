const FPS = 60

const body = document.querySelector("body")
const html = document.querySelector("html")

function randomNumber(min, max, floatPoints=0) {
  let number = min + Math.random() * max

  if(floatPoints == 0) return Math.trunc(number)
  return Number(number.toPrecision(floatPoints + 1))
}

function getWindowsSize() {
  let width = window.innerWidth
  let height = Math.max( 
    body.scrollHeight, 
    body.offsetHeight, 
    html.clientHeight, 
    html.scrollHeight, 
    html.offsetHeight)
  return [width, height]
}

class Background {

  constructor(element, noLoop = false) {

    if(!(element instanceof HTMLCanvasElement)) throw new Error("Element is not a canvas")

    this.element = element
    this.context = element.getContext("2d")

    this.comets = []

    this.fpsCount = 0

    this.stars = []

    this._width = 0
    this._height = 0

    this.fixCanvasSize()

    window.addEventListener("resize", () => {
 
      let [width, height] = getWindowsSize()

      if(width != this.width || this.height != height) this.start()

    })

    if(!noLoop) this.updateFrames() // loop

  }

  fixCanvasSize() {
    let [width, height] = getWindowsSize()

    this.element.width = width
    this.element.height = height

    this._width = width
    this._height = height
  }

  get width() {
    return this._width
  }
  set width(width) {
    this.element.width = width
    this._width = width
  }

  get height() {
    return this._height
  }
  set height(height) {
    this.element.height = height
    this._height = height
  }

  start() { }
  loop() { }

  drawStar(x, y, radius, opacity, comet=false) {
  
    this.context.beginPath()
    this.context.arc(x, y, radius-(radius*0.45), 0, 2 * Math.PI)
    this.context.globalAlpha = opacity
    this.context.fillStyle = "#ffffff"
    this.context.fill()
    this.context.closePath()

    if(comet) {
      this.context.beginPath()
      for(let line of comet) {
        this.context.lineTo(line.x, line.y)
      }
      this.context.strokeStyle = "#fff";
      this.context.stroke()
      this.context.closePath()
    }

  }

  updateFrames() {

    setInterval(() => { this.loop() }, 1000 / FPS)

  }

}

/* STARS */

const bg = new Background(document.querySelector("canvas#background"), true)

bg.start = () => {

  bg.fixCanvasSize()

  bg.context.clearRect(0,0,bg.width,bg.height)

  let stars = bg.width + bg.height

  for(let i = 0; i < stars; i++) {
    bg.drawStar(
      randomNumber(0,bg.width,2), 
      randomNumber(0,bg.height,2), 
      randomNumber(0.2,3.5,2),
      randomNumber(0,1,2)
    )
  }

}

/* COMETS */

const comet = new Background(document.querySelector("canvas#comet"))

comet.start = () => {

  comet.width = bg.width
  comet.height = bg.height

  comet.context.clearRect(0,0,comet.width,comet.height)

  generateRandomComet()

}

function generateRandomComet() {

  let xOrY = randomNumber(1,10)

  let x = 0
  let y = 0

  if(xOrY > 5) {
    x = randomNumber(0, comet.width,2)
  }else{
    y = randomNumber(0, comet.height,2)
  }

  comet.comets.push({
    x: x,
    y: y,
    xspeed: 0,
    yspeed: 0,
    radius: randomNumber(0.5, 3,2),
    opacity: randomNumber(0.3,1,2),
    followLine: [],
    directionX: "right",
    directionY: "bottom",
    accelerationX: randomNumber(0.01, 0.03, 2),
    accelerationY: randomNumber(0.01, 0.03, 2)
  })
}

comet.loop = () => {

  comet.context.clearRect(0,0,comet.width,comet.height)

  for(let cum of comet.comets) {
    cum.followLine.push({x: cum.x, y: cum.y})
    if(cum.followLine.length > 10) cum.followLine.shift()
    cum.x+=cum.xspeed
    cum.y+=cum.yspeed
    comet.drawStar(cum.x, cum.y, cum.radius, cum.opacity, cum.followLine)
    cum.xspeed += cum.directionX == "right" ? cum.accelerationX : cum.accelerationX * -1
    cum.yspeed += cum.directionY == "bottom" ? cum.accelerationY : cum.accelerationY * -1

    if(cum.followLine[0].x > comet.width || 
       cum.followLine[0].y > comet.height) comet.comets.splice(comet.comets.indexOf(cum), 1)
  }

}

function randomCometTime() {

  generateRandomComet()

  setTimeout(() => { randomCometTime() }, randomNumber(1,4) * 1000)
}

randomCometTime()

window.onload = () => {

  bg.start()
  comet.start()

}