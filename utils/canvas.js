let Layer = require('./layer')

module.exports = { create }

function create(width, height) {

  let canvas = Layer.create(width, height)
  let layers = new Set

  Object.assign(canvas, {
    layers,
    addLayer
  })

  return canvas

  function addLayer(layer) {
    if (!layer)
      layer = Layer.create(width, height)
    layers.add(layer)
    return layer
  }

}
