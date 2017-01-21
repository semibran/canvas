module.exports = (...paths) => (callback) => {
  let images = []
  function load(index = 0) {
    let path = paths[index]
    let name = getName(path)
    let image = new Image
    image.src = path
    image.onload = event => {
      images[index] = images[name] = image
      if (++index === paths.length)
        callback(images)
      else
        load(index)
    }
  }
  load()
}

function getName(path) {
  let start = (path.indexOf('/') || 0) + 1
  let end = path.lastIndexOf('.')
  return path.slice(start, end)
}
