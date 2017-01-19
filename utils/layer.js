module.exports = { create }

const directions = {
      'top left': [ 0,    0  ],
           'top': [-0.5,  0  ],
     'top right': [-1,    0  ],
          'left': [ 0,   -0.5],
        'center': [-0.5, -0.5],
         'right': [-1,   -0.5],
   'bottom left': [ 0,   -1  ],
        'bottom': [-0.5, -1  ],
  'bottom right': [-1,   -1  ]
}

function create(width, height) {

  let _queue = []
  let canvas = document.createElement('canvas')
  let context = canvas.getContext('2d')
  canvas.width = width
  canvas.height = height

  let layer = {
    width, height, context,
    draw, queue
  }

  return layer

  function draw(...nodes) {

    if (!nodes.length)
      nodes = _queue

    for (let node of nodes) {

      let { origin = 'top left', x = 0, y = 0, width, height, fill } = node

      let image = fill instanceof HTMLImageElement || fill instanceof HTMLCanvasElement

      if (!width || !height)
        if (image)
          ({width, height} = fill)
        else
          ({width, height} = layer)

      let direction = directions[origin]
      if (!direction)
        throw new TypeError(`Origin '${origin}' for node was not recognized`)

      let [directionX, directionY] = direction

      x += directionX * width
      y += directionY * height

      if (image)
        context.drawImage(fill, x, y, width, height)
      else
        context.fillStyle = fill, context.fillRect(x, y, width, height)

    }

    if (nodes === _queue)
      _queue.length = 0

    return layer

  }

  function queue(...nodes) {
    for (let node of nodes) {
      if (_queue.includes(node))
        throw new TypeError(`Failed to queue node on Layer: node has already been queued`)
      _queue.push(node)
    }
    return layer
  }

}
