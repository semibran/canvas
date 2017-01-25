# canvas
> ~~usable~~ unstable wrapper for canvas api

```javascript
var canvas = Canvas(width, height)
  .rect(fill)(x, y, width, height)
  .circle(fill)(x, y, radius)
  .image(image)(x, y, width, height)

document.body.appendChild(canvas.element)
```

## Documentation
WIP

### Factory
```javascript
// Create from an existing `CanvasRenderingContext2D`...
var canvas = Canvas(context)

// ...or from dimensions to create a blank slate.
var canvas = Canvas(width, height)
```
Creates and returns a new `Canvas` object from the specified `CanvasRenderingContext2D`. Alternatively, you can create a new `Canvas` instance from scratch by passing in the desired `width` and `height`.

### Methods
The primary drawing methods (`rect`, `circle`, `image`) have been curried, allowing you to draw multiple shapes of the same fill by storing the result in a variable for later use (below). They also return the `Canvas` instance, which enables method chaining (above).

```javascript
// Making use of currying to draw some blue rectangles...
var drawBlueRect = canvas.rect('blue')
drawBlueRect(...rect1)
drawBlueRect(...rect2)
```

#### `rect`
```javascript
canvas.rect(fill)(x, y, width, height) // -> canvas
```
Draws a rectangle of the given color and dimensions onto the canvas context.

#### `circle`
```javascript
canvas.circle(fill)(x, y, radius) // -> canvas
```
Draws a circle of the given color and dimensions onto the canvas context.

#### `image`
```javascript
canvas.circle(image)(x, y, width, height) // -> canvas
```
Draws the provided image onto the canvas ontext using the given dimensions.

#### `getPixels`
```javascript
var pixels = canvas.getPixels() // -> pixels
```
Returns a [`Pixels`](https://github.com/semibran/pixels) instance based on the canvas pixel data.

#### `setPixels`
```javascript
canvas.setPixels(pixels) // -> canvas
```
Applies the given `Pixels` instance onto the canvas context.

### Properties

#### `width`
The width of the `Canvas` instance.

#### `height`
The height of the `Canvas` instance.

#### `element`
The `HTMLCanvasElement` which is used to view the results of method use. Equivalent to `canvas.context.canvas`.

```javascript
document.body.appendChild(canvas.element)
```

#### `context`
The `CanvasRenderingContext2D` on which all operations are performed.

## License
MIT
