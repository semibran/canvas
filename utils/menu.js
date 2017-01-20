const Canvas = require('./canvas')
const Node = require('./node')

const squares = 4

module.exports = Menu
Menu.squares = squares

function Menu(sprites) {
  let [square, border] = sprites
  let { width: spriteWidth, height: spriteHeight } = square
  let segmentWidth  = squares * spriteWidth
  let segmentHeight = squares * spriteHeight
  return function create(cols, rows) {

    let width  = segmentWidth  * cols
    let height = segmentHeight * rows

    let segments = cols * rows

    let sprites = ['topLeft', 'top', 'topRight', 'left', 'center', 'right', 'bottomLeft', 'bottom', 'bottomRight']
      .reduce((result, name) => {
        result[name] = Canvas(segmentWidth, segmentHeight)
        return result
      }, {})

    for (let i = squares * squares; i--;) {
      let x = i % squares
      let y = (i - x) / squares
      let pos = [x * spriteWidth, y * spriteHeight]
          sprites.topLeft.image(!x                || !y                ? border : square)(...pos)
              sprites.top.image(                     !y                ? border : square)(...pos)
         sprites.topRight.image(x === squares - 1 || !y                ? border : square)(...pos)
             sprites.left.image(!x                                     ? border : square)(...pos)
           sprites.center.image(                                                  square)(...pos)
            sprites.right.image(x === squares - 1                      ? border : square)(...pos)
       sprites.bottomLeft.image(!x                || y === squares - 1 ? border : square)(...pos)
           sprites.bottom.image(                     y === squares - 1 ? border : square)(...pos)
      sprites.bottomRight.image(x === squares - 1 || y === squares - 1 ? border : square)(...pos)
    }

    let menu = Object.assign(Node({ width, height }), {
      rows, cols, segments,
      visible: false, animation: null,
      on, off, emit,
      show, hide
    })

    let cache = {}
    let index = 0

    function show() {
      if (!menu.animation)
        start('show')
    }

    function hide() {
      if (!menu.animation)
        start('hide')
    }

    function start(animation) {
      let event = null
      if (animation === 'show')
        event = 'showing'
      else if (animation === 'hide')
        event = 'hiding'
      menu.animation = animation
      emit(event)
      animate()
    }

    function animate() {
      let showing = menu.animation === 'show'
      let i = segments
      while (i--) {
        if (showing)
          if (i <= index)
            add(i)
          else
            remove(i)
        else
          if (i <= index)
            remove(i)
          else
            add(i)
      }
      menu.render()
      emit('animate', index)
      if (++index < segments)
        requestAnimationFrame(animate)
      else {
        menu.visible = showing
        emit(menu.animation)
        menu.animation = null
        index = 0
      }
    }

    function add(index) {
      let x = index % cols
      let y = (index - x) / cols
      let sprite = cache[index]
      if (!sprite) {
        sprite = getSprite(x, y)
        cache[index] = sprite
        menu.add(sprite)
      }
    }

    function remove(index) {
      let x = index % cols
      let y = (index - x) / cols
      let sprite = cache[index]
      if (sprite) {
        delete cache[index]
        menu.remove(sprite)
      }
    }

    let eventCallbacks = {}

    function on(event, callback) {
      let callbacks = eventCallbacks[event]
      if (!callbacks)
        callbacks = eventCallbacks[event] = new Set
      callbacks.add(callback)
      return on
    }
    on.on = on

    function off(event, callback) {
      let callbacks = eventCallbacks[event]
      if (callbacks && callbacks.has(callback))
        callbacks.delete(callback)
      return off
    }
    off.off = off

    function emit(event, ...data) {
      let callbacks = eventCallbacks[event]
      if (!callbacks)
        return
      for (let callback of callbacks)
        callback(...data)
    }

    return menu

    function getName(x, y) {
      if (!y)
        if (!x)
          return 'topLeft'
        else if (x === cols - 1)
          return 'topRight'
        else
          return 'top'
      else if (y === rows - 1)
        if (!x)
          return 'bottomLeft'
        else if (x === cols - 1)
          return 'bottomRight'
        else
          return 'bottom'
      else
        if (!x)
          return 'left'
        else if (x === cols - 1)
          return 'right'
        else
          return 'center'
    }

    function getSprite(x, y) {
      let name = getName(x, y)
      let sprite = sprites[name].element
      return Node({ fill: sprite, x: x * segmentWidth, y: y * segmentHeight })
    }

  }

}
