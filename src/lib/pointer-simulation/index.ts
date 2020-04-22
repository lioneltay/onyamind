type Point = { x: number; y: number }

function dispatchMouseEvent({ x, y }: Point, type: "down" | "up") {
  const element = document.elementFromPoint(x, y)
  element?.dispatchEvent(
    new MouseEvent(`mouse${type}`, {
      bubbles: true,
      clientX: x,
      clientY: y,
      buttons: 1,
    }),
  )
}

function moveMouse(from: Point, to: Point, duration: number) {
  const start = performance.now()
  let last = from

  function move(cb = () => {}) {
    requestAnimationFrame((timestamp) => {
      const dt = timestamp - start
      const progress = clamp(0, 1, dt / duration)
      const dx = progress * (to.x - from.x)
      const dy = progress * (to.y - from.y)
      const nx = from.x + dx
      const ny = from.y + dy

      const element = document.elementFromPoint(nx, ny)
      element?.dispatchEvent(
        new MouseEvent("mousemove", {
          bubbles: true,
          clientX: nx,
          clientY: ny,
          movementX: nx - last.x,
          movementY: ny - last.y,
          buttons: 1,
        }),
      )

      last = { x: nx, y: ny }

      if (progress === 1) {
        cb()
      } else {
        move(cb)
      }
    })
  }

  function asyncMove() {
    return new Promise((res) => move(res))
  }

  return asyncMove()
}

async function performDrag(from: Point, to: Point, duration = 1000) {
  dispatchMouseEvent(from, "down")

  await moveMouse(from, to, duration)

  dispatchMouseEvent(to, "up")
}

function clamp(min: number, max: number, value: number): number {
  return Math.min(max, Math.max(min, value))
}

// window.doStuff = async (duration: number = 1000) => {
//   console.log("STARTING")
//   await performDrag({ x: 100, y: 155 }, { x: 420, y: 157 }, duration)
//   console.log("END")
// }

// document.body.addEventListener("mousemove", (event) => {
//   console.log(event)
// })

// document.body.addEventListener("pointermove", (event) => {
//   console.log(event.x, event.y)
// })
