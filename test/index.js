var Canvas = require('../lib')

var canvas = Canvas(256, 224)
  .rect('black')()
  .circle('white')(128, 112, 32)

var pixels = canvas.getPixels()
pixels.replace('white', 'crimson')
canvas.setPixels(pixels)

document.body.appendChild(canvas.element)
