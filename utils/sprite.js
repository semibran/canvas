const Canvas = require('./canvas')

module.exports = function Sprite(image) {
  return function config(width, height) {
    if (!height)
      height = width
    return function get(x, y = 0) {
      if (x === undefined) {
        let cols = image.width  / width
        let rows = image.height / height
        let sprites = []
        for (let i = cols * rows; i--;) {
          let x = i % cols
          let y = (i - x) / cols
          sprites[i] = get(x, y)
        }
        return sprites
      }
      return Canvas(width, height).image(image)(-x * width, -y * height).element
    }
  }
}
