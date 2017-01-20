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

module.exports = {
  directions,
  createContext, getImage, getBounds
}

function createContext(width, height) {
  let canvas = document.createElement('canvas')
  let context = canvas.getContext('2d')
  canvas.width = width
  canvas.height = height
  return context
}

function getImage(value) {
  return value instanceof window.HTMLImageElement || value instanceof window.HTMLCanvasElement ? value : null
}

function getBounds(...rects) {

  if (!rects.length)
    return null

  if (rects.length === 1)
    return rects[0]

  let left   = Infinity
  let top    = Infinity
  let right  = 0
  let bottom = 0

  for (let rect of rects) {
    let [x, y, width, height] = rect
    if (x < left)
      left = x
    if (x + width > right)
      right = x + width
    if (y < top)
      top = y
    if (y + height > bottom)
      bottom = y + height
  }

  return [left, top, right - left, bottom - top]

}
