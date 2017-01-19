const Canvas = require('./utils/canvas')
const load   = require('./utils/image')

let display = Canvas.create(256, 224)
document.body.appendChild(display.context.canvas)

load(['mario.png', 'select.png'], setup)

function setup(images) {

  let mario = {
    fill: images.mario,
    origin: 'center',
    x: display.width  * 0.5,
    y: display.height * 0.75
  }

  display.queue({ fill: images.select }, mario).draw()

  loop()

}

function loop() {

}
