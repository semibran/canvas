const Node = require('./node')

module.exports = { create, createNode }

function create(width, height) {
  return Node.create({ width, height })
}

function createNode(options) {
  return Node.create(options)
}
