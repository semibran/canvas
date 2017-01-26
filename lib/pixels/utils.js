module.exports = function utils(context) {

  if (!context)
    context = document.createElement('canvas').getContext('2d')

  return {
    rgba: rgba, unrgba: unrgba,
    hex: hex, unhex: unhex,
    normalize: normalize
  }

  function rgba(red, green, blue, alpha) {
    return 'rgba(' + red + ', ' + green + ', ' + blue + ', ' + alpha + ')'
  }

  function unrgba(value) {
    var start = value.indexOf('rgba(')
    var end = value.lastIndexOf(')')
    if (start === -1 || end === -1)
        return null
    var array = value.slice(start + 5, end).split(',').map(function (value, index) { return parseInt(value * (index === 3 ? 255 : 1)) })
    if (array.length !== 4 || array.find(function (value) { return isNaN(value) || value < 0 || value > 255 }) !== undefined)
      return null
    return array
  }

  function hex(value) {
    context.fillStyle = value
    return context.fillStyle
  }

  function unhex(value) {
    var result = []
    var i = (value.length - 1) / 2
    while (i--) {
      var index = i * 2 + 1
      result[i] = parseInt(value[index] + value[index + 1], 16)
    }
    return result
  }

  function normalize(value) {
    var hexed = hex(value)
    result = unrgba(hexed)
    if (!result) {
      result = unhex(hexed)
      result[3] = 1
    }
    result = rgba(result[0], result[1], result[2], result[3])
    return result
  }
}
