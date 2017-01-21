const load = require('../utils/image')
const Canvas = require('../utils/canvas')
const Sprite = require('../utils/sprite')
const Display = require('../utils/display')
const Menu = require('../utils/menu')

let wrap = document.querySelector('#app')

let display = Display(256, 224)
wrap.appendChild(display.canvas.element)

let menu, cursor

let dir = 'images/'
let ext = '.png'

let names = ['background', 'select', 'menu', 'mario', 'text', 'tiles']
let paths = names.map(name => dir + name + ext)

load(...paths)(setup)

function setup(images) {

  let squareSize = 8
  let sprites = Sprite(images.menu)(squareSize)()

  let background = Display.Node(images.background)

  let cols = display.width / (squareSize * Menu.squares)
  let rows = 2
  menu = Menu(sprites)(cols, rows)
  menu.y = display.height - menu.height

  let mario = Display.Node(Sprite(images.mario)(16)(0))
  mario.x = menu.width  / 2
  mario.y = menu.height / 2
  mario.origin = 'center'

  cursor = Display.Node(Sprite(images.select)(16)(4))

  menu.on
    ('animate', () => display.render(menu))
    ('show',    () => display.render(menu.add(mario).render()))
    ('hiding',  () => display.render(menu.remove(mario).render()))

  display.add(background, menu, cursor).render()

  window.addEventListener('keydown', handleKeys)
  window.addEventListener('keyup',   handleKeys)
  wrap.addEventListener('mousemove', handleMouse)

  loop()

}

function loop() {

  if (!menu.animation)
    if (keys.Space) {
      if (!menu.visible)
        menu.show()
    } else if (menu.visible)
      menu.hide()

  requestAnimationFrame(loop)

}

let keys = {}
function handleKeys(event) {
  keys[event.code] = event.type === 'keydown'
}

let tileSize = 16
let displayCols = display.width  / tileSize
let displayRows = display.height / tileSize
function handleMouse(event) {
  let { offsetX: x, offsetY: y } = event
  let rect = wrap.getBoundingClientRect()
  x = Math.floor(x / rect.width  * displayCols)
  y = Math.floor(y / rect.height * displayRows)
  if (cursor.x / tileSize - x || cursor.y / tileSize - y) {
    cursor.x = x * tileSize
    cursor.y = y * tileSize
    display.render()
  }
}
