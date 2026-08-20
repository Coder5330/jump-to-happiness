have fun

# a rage platformer

a canvas platformer that's low-key designed to mess with you. invisible platforms, a toll booth that might just kill you for fun, a button that's basically a coin flip with your life, and red light green light because why not.

## how to run it

chuck `game.js` in a page with a canvas called `board`:

```html
<canvas id="board"></canvas>
<script src="game.js"></script>
```

it fills the whole window and the camera follows you around.

## controls

- `A` / `D` — move
- `space` — jump (has a bit of buffer so you don't have to frame-perfect it)

heads up: controls randomly flip sometimes. not a bug, that's the bit.

## what's actually in this thing

- **normal platforming stuff** — gravity, friction, jumping, the usual
- **conveyor belts** — hit one from the side and you get yeeted, then it's on cooldown
- **wind zones** — pushes you around, softens your fall while you're in it
- **meteors** — fall from the sky, touch = death
- **spikes / fake sky** — also just death
- **invisible platforms** — solid, but you can't see them. good luck. warns you once
- **the button** — teleports you, kills you, or resets you. random. no way to know which
- **checkpoint** — respawn here instead of the start once you hit it
- **ghost trail** — every time you die it leaves a little translucent replay of that run
- **the toll** — every ~40s it demands payment, 50/50 it just kills you anyway
- **red light green light** — screen flashes red, moving (even falling) during red = dead. countdown pops big in the middle for the last 3 seconds before it flips

## code layout

all the changing state lives in one `state` object instead of a pile of loose variables. level stuff (platforms, spikes, etc) is just consts up top. the per-frame player update got split into small functions instead of one giant blob:

- `computeGroundFriction` — what's under your feet
- `applyHorizontalMovement` — input + boost stuff
- `applyVerticalForces` — gravity, jump, wind
- `resolveCollisions` — the big one, handles hitting stuff
- `updateMeteors`, `updateMovingPlatforms` — per-entity updates
- `clampPlayerToWorld`, `checkHazards`, `recordTrail` — cleanup at the end of the frame

`move()` just calls these in order each frame. `draw()` renders the world, then draws UI stuff (timer, red overlay) separately so it doesn't scroll with the camera. `loop()` ties it together with `requestAnimationFrame`.

## heads up

dying during red light because you were just falling (not even moving) is intentional. that's the rage part.
