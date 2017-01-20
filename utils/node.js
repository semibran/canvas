const { directions, createContext, getImage, getBounds } = require('./utils')

module.exports = { create }

function create(options) {

  let { origin = 'top left', x = 0, y = 0, width = 0, height = 0, fill = 'transparent' } = options

  let image = getImage(fill)

  if (!width || !height)
    if (image)
      width = image.width, height = image.height

  let context = createContext(width, height)

  let children = new Map
  if (options.children)
    for (let child of options.children)
      children.set(child, null)

  let node = {}

  Object.assign(node, options, {
    origin, x, y, width, height, fill, context,
    add, render
  })

  render()

  return node

  function add(...nodes) {
    for (let child of nodes) {
      let rect = drawNode(context, child)
      children.set(child, rect)
    }
  }

  function render() {

    if (!children.size) {
      renderNode(context, node)
      return node
    }

    let damage = getDamage(children)

    if (!damage)
      return node

    let overlay = createContext(node.width, node.height)
    overlay.rect(...damage)
    overlay.clip()

    if (node.fill !== 'transparent')
      renderNode(overlay, node)
    else
      context.clearRect(...damage)
    for (let [child] of children) {
      let rect = drawNode(overlay, child)
      children.set(child, rect)
    }

    context.drawImage(overlay.canvas, 0, 0)

    return node

  }

}

function getRect(node) {
  let { origin, x, y, width, height } = node

  let [directionX, directionY] = directions[origin]
  x += directionX * width
  y += directionY * height

  return [x, y, width, height]
}

function getDamaged(children) {
  return [...children]
    .filter(([child, rect]) => !rect || getRect(child).find((value, index) => value !== rect[index]) !== undefined)
    .map(([child, rect]) => child)
}

function getDamage(children) {

  let damaged = getDamaged(children)
  if (!damaged.length)
    return null

  let rects = []
  for (let child of damaged) {
    let last = children.get(child)
    let rect = getRect(child)
    if (last)
      rects.push(last)
    rects.push(rect)
  }

  let damage = getBounds(...rects)
  return damage

}

function renderNode(context, node) {
  let { width, height, fill } = node
  let rect = [0, 0, width, height]
  let image = getImage(fill)
  if (image) {
    context.drawImage(image, ...rect)
  } else if (fill !== 'transparent') {
    context.fillStyle = node.fill
    context.fillRect(...rect)
  }
}

function drawNode(context, node, rect) {
  if (!rect)
    rect = getRect(node)
  context.drawImage(node.context.canvas, ...rect)
  return rect
}
