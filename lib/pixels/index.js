var context = document.createElement('canvas').getContext('2d')

var Grid = require('./grid')
var utils = require('./utils')(context)

module.exports = function Pixels(width, height) {

  var imageData
  if (width instanceof window.ImageData) {
    imageData = width
    width = imageData.width
    height = imageData.height
  } else
    imageData = context.createImageData(width, height)

  var data = imageData.data
  var grid = Grid(width, height)

  var colors = []

  for (var i = 0, max = width * height; i < max; i++) {
    var index = i * 4
    var red   = data[index]
    var green = data[index + 1]
    var blue  = data[index + 2]
    var alpha = data[index + 3] / 255
    var color = utils.rgba(red, green, blue, alpha)
    grid.data[i] = getIndex(color)
  }

  var pixels = {
    width: width, height: height,
    colors: colors,
    grid: grid,
    data: imageData,
    get: get, set: set,
    each: each, replace: replace,
    compile: compile
  }
  return pixels

  function get(x, y) {
    index = grid.get(x, y)
    return colors[index]
  }

  function set(color) {
    color = utils.normalize(color)
    var index = getIndex(color)
    return function set(x, y) {
      grid.set(index)(x, y)
      return set
    }
  }

  function each(callback) {
    grid.each((x, y, value) => {
      var color = colors[value]
      callback(x, y, color)
    })
    return pixels
  }

  function replace(oldColor, newColor) {
    oldColor = utils.normalize(oldColor)
    newColor = utils.normalize(newColor)
    var index = getIndex(oldColor)
    colors[index] = newColor
    return pixels
  }

  function compile() {
    var i = grid.data.length
    while (i--) {
      var value = grid.data[i]
      var color = utils.unrgba(colors[value])
      var red   = color[0]
      var green = color[1]
      var blue  = color[2]
      var alpha = color[3]
      var index = i * 4
      data[index]     = red
      data[index + 1] = green
      data[index + 2] = blue
      data[index + 3] = alpha
    }
    return imageData
  }

  function getIndex(color) {
    var index = colors.indexOf(color)
    if (index === -1) {
      index = colors.length
      colors[index] = color
    }
    return index
  }
}
