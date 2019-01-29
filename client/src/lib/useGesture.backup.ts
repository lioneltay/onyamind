import React, { useEffect, useMemo } from "react"
import { Subject, timer, Subscription, merge, of } from "rxjs"
import {
  takeUntil,
  switchMap,
  take,
  map,
  filter,
  withLatestFrom,
  delay,
} from "rxjs/operators"

let calls = 0

type Vector = [number, number]

type UseGestureInput = {
  onPointerDown?: (e: React.PointerEvent) => void
  onPointerUp?: (e: React.PointerEvent) => void
  onPointerMove?: (e: React.PointerEvent) => void

  onSwipe?: (input: { direction: Vector }) => void
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void

  onPull?: (input: { delta: Vector; distance: number }) => void

  onPress?: () => void

  onHold?: () => void
}

type Handlers = {
  ref: React.Ref<any>
  onPointerDown: (e: React.PointerEvent) => void
  onPointerUp: (e: React.PointerEvent) => void
  onPointerMove: (e: React.PointerEvent) => void
}

type Bind = (input?: Partial<Handlers>) => Handlers

const distance = ([x1, y1]: Vector, [x2, y2]: Vector): number =>
  Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))

const displacement = ([x1, y1]: Vector, [x2, y2]: Vector): Vector => [
  x2 - x1,
  y2 - y1,
]

function direction([x1, y1]: Vector, [x2, y2]: Vector): number {
  return Math.atan2(-(y2 - y1), x2 - x1)
}

const eventPosition = (e: { clientX: number; clientY: number }): Vector => [
  e.clientX,
  e.clientY,
]

export const useGesture = ({
  onPress,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onHold,
  onPull,
  onSwipeLeft,
  onSwipeRight,
}: UseGestureInput): Bind => {
  const down_s = useMemo(() => new Subject<React.PointerEvent>(), [])
  const up_s = useMemo(() => new Subject<React.PointerEvent>(), [])
  const move_s = useMemo(() => new Subject<React.PointerEvent>(), [])

  useEffect(() => {
    const subscriptions: Subscription[] = []

    const down_data_s = down_s.pipe(
      map(down_e => ({
        down_e,
        down_time: Date.now(),
      })),
    )

    const pull_s = down_s.pipe(
      switchMap(down_e =>
        move_s.pipe(
          map(move_e => {
            const start_p = eventPosition(down_e)
            const end_p = eventPosition(move_e)
            return {
              delta: displacement(start_p, end_p),
              distance: distance(start_p, end_p),
            }
          }),
          filter(({ distance }) => distance > 30),
          takeUntil(up_s),
        ),
      ),
    )

    const press_s = down_data_s.pipe(
      switchMap(({ down_e, down_time }) =>
        up_s.pipe(
          take(1),
          filter(up_e => {
            const down_p = eventPosition(down_e)
            const up_p = eventPosition(up_e)

            return Date.now() - down_time < 500 && distance(down_p, up_p) < 30
          }),
        ),
      ),
    )

    const drag_start_s = down_s.pipe(
      switchMap(down_e =>
        move_s.pipe(
          filter(move_e => {
            return distance(eventPosition(move_e), eventPosition(down_e)) < 30
          }),
          take(1),
        ),
      ),
    )

    // const hold_s = down_s.pipe(
    //   switchMap(() => timer(500).pipe(takeUntil(merge(up_s, drag_start_s)))),
    // )

    const hold_s = down_data_s.pipe(
      switchMap(({ down_e, down_time }) =>
        timer(500).pipe(
          takeUntil(up_s),
          takeUntil(
            move_s.pipe(
              filter(
                move_e =>
                  distance(eventPosition(move_e), eventPosition(down_e)) < 30,
              ),
              take(1),
            ),
          ),
        ),
      ),
    )

    const swipe_s = down_s.pipe(
      switchMap(down_e =>
        up_s.pipe(
          take(1),
          withLatestFrom(
            merge(
              of({ start_e: down_e, start_time: Date.now() }),
              move_s.pipe(
                map(move_e => ({ start_e: move_e, start_time: Date.now() })),
                delay(100),
              ),
            ),
          ),
          filter(([up_e, { start_e, start_time }]) => {
            const time = Date.now() - start_time
            const start_p = eventPosition(start_e)
            const up_p = eventPosition(up_e)
            const speed = distance(start_p, up_p) / (time / 1000)
            return speed > 500
          }),
          map(([up_e, { start_e }]) => {
            return {
              direction: direction(eventPosition(start_e), eventPosition(up_e)),
            }
          }),
        ),
      ),
    )

    const swipe_right_s = swipe_s.pipe(
      filter(({ direction }) => {
        const delta = (1 / 4) * Math.PI
        return Math.abs(direction) < delta
      }),
    )

    const swipe_left_s = swipe_s.pipe(
      filter(({ direction }) => {
        const delta = (1 / 4) * Math.PI
        return Math.abs(direction) > Math.PI - delta
      }),
    )

    // subscriptions.push(move_s.subscribe(console.log))

    onSwipeLeft && subscriptions.push(swipe_left_s.subscribe(onSwipeLeft))
    onSwipeRight && subscriptions.push(swipe_right_s.subscribe(onSwipeRight))
    onPointerDown && subscriptions.push(down_s.subscribe(onPointerDown))
    onPointerUp && subscriptions.push(up_s.subscribe(onPointerUp))
    onPointerMove && subscriptions.push(move_s.subscribe(onPointerMove))
    onPress && subscriptions.push(press_s.subscribe(onPress))
    onHold && subscriptions.push(hold_s.subscribe(onHold))
    onPull && subscriptions.push(pull_s.subscribe(onPull))

    return () => subscriptions.forEach(sub => sub.unsubscribe())
  })

  return (input = {}) => {
    const { ref, onPointerDown, onPointerMove, onPointerUp } = input
    const gg = calls++

    type RegisteredHandler = {
      node: HTMLElement
      type: string
      listener: EventListener
    }
    let registered_handlers: RegisteredHandler[] = []

    return {
      /**
       * We put all the ref logic in here so that the bind function is hook free and reusable amongst multiple elements
       */
      ref: (el: HTMLElement | null) => {
        console.log("REF", el)

        if (typeof ref === "function") {
          ref(el)
        }

        if (typeof ref === "object" && ref !== null) {
          ;(ref as any).current = el
        }

        const addEventListener = <K extends keyof HTMLElementEventMap>(
          node: HTMLElement,
          type: K,
          listener: (ev: HTMLElementEventMap[K]) => any,
        ) => {
          node.addEventListener(type, listener)
          registered_handlers.push({
            node,
            type,
            listener,
          })
        }

        const registerHandlers = (node: HTMLElement) => {
          let down_p: Vector
          let noscroll = false

          const touchStartHandler = (e: TouchEvent) => {
            down_p = eventPosition(e.touches[0])
          }

          const touchMoveHandler = (e: TouchEvent) => {
            if (!e.cancelable) {
              return
            }

            if (noscroll) {
              e.preventDefault()
              return
            }

            const move_p = eventPosition(e.touches[0])
            const dir = direction(down_p, move_p)
            const delta = (1 / 4) * Math.PI

            if (
              (onSwipeRight && Math.abs(dir) < delta) ||
              (onSwipeLeft && Math.abs(dir) > Math.PI - delta)
            ) {
              e.preventDefault()
              noscroll = true
            }
          }

          const touchEndHandler = (e: TouchEvent) => {
            noscroll = false
          }

          addEventListener(node, "touchstart", touchStartHandler)
          addEventListener(node, "touchmove", touchMoveHandler)
          addEventListener(node, "touchend", touchEndHandler)
        }

        const deregisterHandlers = () => {
          registered_handlers.forEach(({ node, type, listener }) => {
            console.log("DEREGISTRATION")
            node.removeEventListener(type, listener)
          })
          registered_handlers = []
        }

        if (el) {
          console.log("REGISTER", gg)
          registerHandlers(el)
        } else {
          console.log("@DEREGISTER BEING:", gg)
          /**
           * Although not as many deregistrations happen as registrations, eventListeners are cleaned up when dom nodes are removed (garbage collection) so don't sweat it.
           * deregisterHandlers is just there in some strange case where the ref changes... without... the dom node being removed? Not sure
           */
          deregisterHandlers()
        }
      },

      onPointerDown: e => {
        e.persist()
        down_s.next(e)
        onPointerDown && onPointerDown(e)
      },

      onPointerUp: e => {
        e.persist()
        up_s.next(e)
        onPointerUp && onPointerUp(e)
      },

      onPointerMove: e => {
        e.persist()
        move_s.next(e)
        onPointerMove && onPointerMove(e)
      },
    }
  }
}
