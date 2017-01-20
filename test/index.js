const load = require('../utils/image')
const Canvas = require('../utils/canvas')
const Sprite = require('../utils/sprite')
const Display = require('../utils/display')
const Menu = require('../utils/menu')

let display = Display(256, 224)
document.body.appendChild(display.canvas.element)

let menu

load(['select.png', 'menu.png', 'mario.png'], setup)

function setup(images) {

  let squareSize = 8
  let sprites = Sprite(images.menu)(squareSize)()

  let background = Display.Node({ fill: images.select })

  let cols = display.width / (squareSize * Menu.squares)
  let rows = 2
  menu = Menu(sprites)(cols, rows)
  menu.y = display.height - menu.height

  let mario = Display.Node({ fill: Sprite(images.mario)(16)(0), x: menu.width / 2, y: menu.height / 2, origin: 'center' })

  menu.on
    ('animate', () => display.render(menu))
    ('show',    () => display.render(menu.add(mario).render()))
    ('hiding',  () => display.render(menu.remove(mario).render()))

  display.add(background, menu).render()

  window.addEventListener('keydown', handleKeys)
  window.addEventListener('keyup',   handleKeys)

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
