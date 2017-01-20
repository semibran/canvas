module.exports = function Canvas(width, height) {

  let element, context
  if (width instanceof window.CanvasRenderingContext2D) {
    context = width
    element = context.canvas
    width = element.width
    height = element.height
  } else {
    if (!width)
      throw new TypeError(`Failed to create new 'Canvas': Invalid width ${width}`)
    if (!height)
      height = width
    element = document.createElement('canvas')
    context = element.getContext('2d')
    element.width = width
    element.height = height
  }

  let canvas = {
    width, height, element, context,
    rect, clear, mask, image
  }
  return canvas

  function rect(fill = 'transparent', stroke = 'transparent', strokeWidth = 1) {
    return function draw(x = 0, y = 0, width = element.width, height = element.height) {
      context.fillStyle   = fill
      context.strokeStyle = stroke
      context.lineWidth   = strokeWidth
      context.beginPath()
      context.rect(x, y, width, height)
      context.fill()
      context.stroke()
      return canvas
    }
  }

  function clear(x = 0, y = 0, width = element.width, height = element.height) {
    context.clearRect(x, y, width, height)
    return canvas
  }

  function mask(x = 0, y = 0, width = element.width, height = element.height) {
    context.rect(x, y, width, height)
    context.clip()
    return canvas
  }

  function image(image) {
    return function draw(x = 0, y = 0, width = image.width, height = image.height) {
      context.drawImage(image, x, y, width, height)
      return canvas
    }
  }

}
