var regex = /^\/?(?:.+\/)*(.+)\./

module.exports = load

function load(paths, callback) {
  if (!callback)
    return
  if (!Array.isArray(paths))
    return loadOne(paths, callback)
  var images = []
  var index  = 0
  var max    = paths.length
  var path   = paths[index]
  var loaded = [path]
  function next(image) {
    var id = regex.exec(path)[1]
    if (!images[id])
      images[id] = image
    else
      images[id] = [images[id], image]
    images[index++] = image
    if (index >= max)
      return callback(images)
    path = paths[index]
    loadOne(path, next)
  }
  loadOne(path, next)
}

function loadOne(path, callback) {
  if (!callback)
    return
  var image = new window.Image
  image.src = path
  image.onload = function () {
    callback(image)
  }
}
