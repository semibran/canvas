const Display = require('./utils/display')

const load        = require('./utils/image')
const Spritesheet = require('./utils/spritesheet')

let display = Display.create(256, 224)
document.body.appendChild(display.context.canvas)

let background, rect, sprite

load(['mario.png', 'select.png'], setup)

function setup(images) {

  let image = Spritesheet.makeSprite(images.mario, [80, 0, 16, 16])

  background = Display.createNode({ fill: images.select })
  rect = Display.createNode({ fill: '#9290ff', origin: 'center', x: display.width / 2, y: -16, width: 32, height: 32 })

  sprite = Display.createNode({
    fill: image,
    origin: 'center',
    x: rect.width / 2,
    y: rect.height / 2
  })

  rect.add(sprite)
  display.add(background, rect)

  loop()

}

function loop() {

  sprite.x++
  while (sprite.x > rect.width + sprite.width / 2)
    sprite.x -= rect.width + sprite.width
  rect.render()

  rect.y++
  while (rect.y > display.height + rect.height / 2)
    rect.y -= display.height + rect.height
  display.render()

  requestAnimationFrame(loop)
}
