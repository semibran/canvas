var Pixels = require('./pixels')

module.exports = function Canvas(width, height) {

  var context, element
  if (width instanceof window.CanvasRenderingContext2D) {
    context = width
    element = context.canvas
    width = element.width
    height = element.height
  } else {
    element = document.createElement('canvas')
    context = element.getContext('2d')
    element.width = width
    element.height = height
  }

  context.imageSmoothingEnabled = false

  var canvas = {
    element: element,
    context: context,
    width: width, height: height,
    rect: rect, circle: circle, image: image,
    getPixels: getPixels, setPixels: setPixels
  }

  return canvas

  function rect(fill) {
    return function drawRect(x, y, width, height) {
      if (!x && !y)
        x = 0, y = 0
      if (!width && !height)
        width = element.width, height = element.height
      context.fillStyle = fill
      context.fillRect(x, y, width, height)
      return canvas
    }
  }

  function circle(fill) {
    return function drawCircle(x, y, radius) {
      context.fillStyle = fill
      context.beginPath()
      context.arc(x, y, radius, 0, 2 * Math.PI)
      context.fill()
      return canvas
    }
  }

  function image(image) {
    return function drawImage(x, y, width, height) {
      if (!x)
        x = 0
      if (!y)
        y = 0
      if (!width)
        width = image.width
      if (!height)
        height = image.height
      context.drawImage(image, x, y, width, height)
      return canvas
    }
  }

  function getPixels() {
    var imageData = context.getImageData(0, 0, width, height)
    var pixels = Pixels(imageData)
    return pixels
  }

  function setPixels(pixels) {
    var imageData = pixels.compile()
    context.putImageData(imageData, 0, 0)
    return canvas
  }

}
