import React, { useEffect, useMemo, useRef, useCallback, useState } from "react"
import {
  Subject,
  timer,
  Subscription,
  merge,
  of,
  animationFrameScheduler,
} from "rxjs"
import {
  skipUntil,
  throttleTime,
  takeUntil,
  switchMap,
  take,
  map,
  filter,
  withLatestFrom,
  delay,
  tap,
} from "rxjs/operators"

type Vector = [number, number]

type UseGestureInput = {
  onPointerDown?: (e: React.PointerEvent) => void
  onPointerMove?: (e: React.PointerEvent) => void

  onSwipe?: (input: { direction: Vector }) => void
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void

  onPull?: (input: { displacement: Vector; distance: number }) => void
  onPullEnd?: () => void

  onPress?: () => void

  onHold?: () => void
}

type Handlers = {
  ref: React.Ref<any>
  onPointerDown: (e: React.PointerEvent) => void
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

const up_s = new Subject<PointerEvent>()
const handler = (e: PointerEvent) => {
  up_s.next(e)
}
let listeners = 0

export const useGesture = ({
  onPress = () => {},
  onPointerDown = () => {},
  onPointerMove = () => {},
  onHold = () => {},
  onPull = () => {},
  onPullEnd = () => {},
  onSwipeLeft = () => {},
  onSwipeRight = () => {},
}: UseGestureInput): Bind => {
  const down_s = useMemo(() => new Subject<React.PointerEvent>(), [])
  const move_s = useMemo(() => new Subject<React.PointerEvent>(), [])

  const onPointerDownRef = useRef(onPointerDown)
  onPointerDownRef.current = onPointerDown
  const onPointerMoveRef = useRef(onPointerMove)
  onPointerMoveRef.current = onPointerMove
  const onPressRef = useRef(onPress)
  onPressRef.current = onPress
  const onHoldRef = useRef(onHold)
  onHoldRef.current = onHold
  const onPullRef = useRef(onPull)
  onPullRef.current = onPull
  const onPullEndRef = useRef(onPullEnd)
  onPullEndRef.current = onPullEnd
  const onSwipeLeftRef = useRef(onSwipeLeft)
  onSwipeLeftRef.current = onSwipeLeft
  const onSwipeRightRef = useRef(onSwipeRight)
  onSwipeRightRef.current = onSwipeRight

  useEffect(() => {
    if (listeners <= 0) {
      document.addEventListener("pointerup", handler)
    }
    listeners++
    return () => {
      if (--listeners <= 0) {
        document.removeEventListener("pointerup", handler)
      }
    }
  }, [])

  useEffect(() => {
    const down_data_s = down_s.pipe(
      map(down_e => ({
        down_e,
        down_time: Date.now(),
      })),
    )

    const pull_data_s = down_s.pipe(
      switchMap(down_e =>
        move_s.pipe(
          map(move_e => {
            const start_p = eventPosition(down_e)
            const end_p = eventPosition(move_e)
            return {
              displacement: displacement(start_p, end_p),
              distance: distance(start_p, end_p),
            }
          }),
          throttleTime(0, animationFrameScheduler),
        ),
      ),
    )

    const pull_s = down_s.pipe(
      switchMap(down_e => {
        const data_s = move_s.pipe(
          map(move_e => {
            const start_p = eventPosition(down_e)
            const end_p = eventPosition(move_e)
            return {
              displacement: displacement(start_p, end_p),
              distance: distance(start_p, end_p),
            }
          }),
          throttleTime(0, animationFrameScheduler),
          takeUntil(up_s),
        )

        return data_s.pipe(
          skipUntil(data_s.pipe(filter(({ distance }) => distance > 30))),
          takeUntil(up_s),
        )
      }),
    )

    // this should work but rxjs is dodgy...
    // const pull_end_s = down_s.pipe(
    //   switchMap(() => up_s.pipe(skipUntil(pull_s))),
    // )

    // this is a dodgy work around...
    const pull_end_s = down_s.pipe(switchMap(() => up_s.pipe(take(1))))

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

    const subscriptions: Subscription[] = []

    subscriptions.push(swipe_left_s.subscribe(val => onSwipeLeftRef.current()))
    subscriptions.push(
      swipe_right_s.subscribe(val => onSwipeRightRef.current()),
    )
    subscriptions.push(down_s.subscribe(val => onPointerDownRef.current(val)))
    subscriptions.push(move_s.subscribe(val => onPointerMoveRef.current(val)))
    subscriptions.push(press_s.subscribe(val => onPressRef.current()))
    subscriptions.push(hold_s.subscribe(val => onHoldRef.current()))
    subscriptions.push(pull_s.subscribe(val => onPullRef.current(val)))
    subscriptions.push(pull_end_s.subscribe(val => onPullEndRef.current()))

    return () => subscriptions.forEach(sub => sub.unsubscribe())
  }, [])

  const [ref, setRef] = useState(null as null | HTMLElement)
  type RegisteredHandler = {
    node: HTMLElement
    type: string
    listener: EventListener
  }
  const handlers_ref = useRef([] as RegisteredHandler[])

  const addEventListener = useCallback(
    <K extends keyof HTMLElementEventMap>(
      node: HTMLElement,
      type: K,
      listener: (ev: HTMLElementEventMap[K]) => any,
    ) => {
      node.addEventListener(type, listener)
      handlers_ref.current.push({
        node,
        type,
        listener,
      })
    },
    [],
  )

  const removeEventListeners = () => {
    handlers_ref.current.forEach(({ node, type, listener }) => {
      node.removeEventListener(type, listener)
    })
    handlers_ref.current = []
  }

  useEffect(
    () => {
      const node = ref
      if (!node) {
        return
      }

      let down_p: Vector | null
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

        if (!down_p) {
          return e.preventDefault()
        }

        const move_p = eventPosition(e.touches[0])
        const dir = direction(down_p, move_p)
        const delta = (1 / 4) * Math.PI

        if (Math.abs(dir) < delta || Math.abs(dir) > Math.PI - delta) {
          e.preventDefault()
          noscroll = true
        }
      }

      const touchEndHandler = (e: TouchEvent) => {
        noscroll = false
        down_p = null
      }

      addEventListener(node, "touchstart", touchStartHandler)
      addEventListener(node, "touchmove", touchMoveHandler)
      addEventListener(node, "touchend", touchEndHandler)

      return () => removeEventListeners()
    },
    [ref, onSwipeLeft, onSwipeRight],
  )

  return (input = {}) => ({
    onPointerDown: e => {
      e.persist()
      down_s.next(e)
      input.onPointerDown && input.onPointerDown(e)
    },

    // onPointerUp: e => {
    //   e.persist()
    //   up_s.next(e)
    //   input.onPointerUp && input.onPointerUp(e)
    // },

    onPointerMove: e => {
      e.persist()
      move_s.next(e)
      input.onPointerMove && input.onPointerMove(e)
    },

    ref: (el: HTMLElement | null) => {
      if (el && ref !== el) {
        setRef(el)
      }

      if (typeof input.ref === "function") {
        input.ref(el)
      }

      if (typeof input.ref === "object" && input.ref !== null) {
        ;(input.ref as any).current = el
      }
    },
  })
}
