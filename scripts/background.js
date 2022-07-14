var body = document.querySelector("body")

class AbstractBackground {

  constructor(canvas) {

    this.canvas = document.querySelector(canvas)
    this.context = this.canvas.getContext("2d")

  }

  drawStar({
    x, y, radius, opacity
  }) {
    // Circle
    this.context.beginPath()
    this.context.arc(x, y, radius*0.53, 0, Math.PI*2)
    this.context.globalAlpha = opacity
    this.context.fillStyle = "#ffffff"
    this.context.fill()
    this.context.closePath()

    // Square
    this.context.save()
    
    this.context.translate(x, y)
    this.context.rotate(45 * Math.PI / 180)

    this.context.globalAlpha = opacity
    this.context.fillStyle = "#ffffff"
    this.context.fillRect(-radius/2, -radius/2, radius, radius)

    this.context.restore()
  }

}

class StarsBackground extends AbstractBackground {

  constructor(canvas, amount) {

    super(canvas)

    this.starsAmount = amount
    this.defaultAmount = !amount // If client gives an amount, then default amount is not true.

    this.fixSize()
    this.drawStars()
    this.sizeLoop()

    this.revealAnimation()
  }

  revealAnimation() {
    this.canvas.style.opacity = "1"
  }

  sizeLoop() {

    if(this.canvas.width < body.clientWidth
    || this.canvas.height < body.clientHeight) {
      this.fixSize()
      this.drawStars()
    }

    requestAnimationFrame(() => { this.sizeLoop() })

  }

  fixSize() {
    this.canvas.width = body.clientWidth
    this.canvas.height = body.clientHeight

    if(this.defaultAmount) this.starsAmount = (this.canvas.width + this.canvas.height) / 3
  }

  drawStars() {

    for(let i = 0; i < this.starsAmount; i++) {

      this.drawStar({
        x: randomNumber(0, this.canvas.width, 4),
        y: randomNumber(0, this.canvas.height, 4),
        opacity: randomNumber(0.2, 1, 2),
        radius: randomNumber(1, 4, 4)
      })

    }

  }

}

class CometsBackground extends AbstractBackground {

  constructor(canvas) {

    super(canvas)

    this.comets = []

    this.#init()
  }

  #init() {
    this.start()
    this.loop()
  }

  start() {

    this.canvas.width = window.innerWidth

    setTimeout(() => { this.generateCometsLoop() }, 2000)

  }

  generateCometsLoop() {

    let xy = randomNumber(0, 10)

    let x = 0, y = 0

    if(xy > 5) x = randomNumber(0, this.canvas.width/4*3, 4)
    else y = randomNumber(0, this.canvas.height/4*3, 4)

    if(document.hasFocus()) this.createComet({
      x,
      y,
      opacity: randomNumber(0.3, 1, 4),
      radius: randomNumber(1, 3, 4)
    })

    setTimeout(() => { this.generateCometsLoop() }, randomNumber(1,4,2) * 1000)

  }

  loop() {

    this.canvas.height = body.clientHeight
    if(this.canvas.width != body.clientWidth) this.canvas.width = body.clientWidth

    for(let comet of this.comets) {

      this.updateComet(comet)
      this.drawComet(comet)

    }

    requestAnimationFrame(() => { this.loop() })
  }

  createComet({x, y, radius, opacity}) {
    this.comets.push({
      x, y, radius, opacity,
      xspeed: 2,
      yspeed: 2,
      lines: []
    })
  }

  removeComet(comet) {

    this.comets.splice(this.comets.indexOf(comet), 1)

  }

  updateComet(comet) {

    comet.lines.push({x: comet.x, y: comet.y})

    if(comet.lines.length > comet.radius*4) comet.lines.shift() 

    comet.x += comet.xspeed
    comet.y += comet.yspeed

    if(comet.lines[0].x > this.canvas.width
    || comet.lines[0].y > this.canvas.height) this.removeComet(comet)

  }

  drawComet(comet) {

    this.drawStar(comet)

    this.context.beginPath()
    for(let line of comet.lines) {
      this.context.lineTo(line.x, line.y)
    }
    this.context.strokeStyle = "#fff";
    this.context.stroke()
    this.context.closePath()

  }

}