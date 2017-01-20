const Canvas = require('./canvas')
const { directions, createContext, getImage, getBounds } = require('./utils')

module.exports = function create(options) {

  if (!options)
    return null

  let { origin = 'top left', x = 0, y = 0, width = 0, height = 0, fill = 'transparent' } = options

  let image = getImage(fill)

  if (!width || !height)
    if (image)
      width = image.width, height = image.height

  let canvas = Canvas(width, height)

  let drawn    = false
  let removed  = []
  let children = new Map

  let node = Object.assign({}, options, {
    origin, x, y, width, height, fill,
    canvas,
    add, remove, has, render
  })

  renderNode(canvas, node)

  return node

  function add(...nodes) {
    for (let child of nodes) {
      if (children.has(child))
        throw new TypeError('Failed to add child to node: target is already a child')
      children.set(child, null)
    }
    return node
  }

  function remove(...nodes) {
    for (let child of nodes) {
      if (!children.has(child))
        throw new TypeError('Failed to remove child from node: target is not a child')
      removed.push(child)
    }
    return node
  }

  function has(...nodes) {
    for (let child of nodes)
      if (!children.has(child))
        return false
    return true
  }

  function render(...force) {

    if (!force)
      force = []

    force = removed.concat(force)

    if (drawn && !children.size)
      return node

    let damage
    if (!drawn) {
      drawn = true
      damage = [0, 0, node.width, node.height]
    } else
      damage = getDamage(children, force)

    if (!damage)
      return node

    let overlay = Canvas(node.width, node.height)
    overlay.mask(...damage)

    if (node.fill !== 'transparent')
      renderNode(overlay, node)
    else
      canvas.clear(...damage)
    for (let [child] of children) {
      if (removed.includes(child)) {
        children.delete(child)
        continue
      }
      let rect = drawNode(overlay, child)
      children.set(child, rect)
    }

    canvas.image(overlay.element)()

    removed.length = 0

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

function getDamaged(children, force) {
  let damaged = [...children]
    .filter(([child, rect]) => !rect || getRect(child).find((value, index) => value !== rect[index]) !== undefined)
    .map(([child, rect]) => child)
  if (force && force.length)
    damaged.push(...force)
  return damaged
}

function getDamage(children, force) {

  let damaged = getDamaged(children, force)
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

function renderNode(canvas, node) {
  let { width, height, fill } = node
  let rect = [0, 0, width, height]
  let image = getImage(fill)
  if (image)
    canvas.image(image)(...rect)
  else if (fill !== 'transparent')
    canvas.rect(fill)(...rect)
}

function drawNode(canvas, node, rect) {
  if (!rect)
    rect = getRect(node)
  canvas.image(node.canvas.element)(...rect)
  return rect
}
