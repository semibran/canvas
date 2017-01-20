const Node = require('./node')

module.exports = Display
Display.Node = createNode

function Display(width, height) {
  return Node({ width, height })
}

function createNode(options) {
  return Node(options)
}
