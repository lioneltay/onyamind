import React from "react"
import { noopTemplate as css, noop } from "lib/utils"

import { useSpring, config, animated } from "react-spring"
import { useGesture } from "react-use-gesture"

import { IconButton, ListItem } from "@material-ui/core"

import { DeleteIcon, CheckIcon } from "lib/icons"

import Task, { TaskProps as TaskComponentProps } from "./Task"

import { logError } from "services/analytics/error-reporting"

const useInstance = <T extends Record<string, any>>(initialValue: T) => {
  const { current } = React.useRef(initialValue)
  return current
}

type Direction = "left" | "right" | "none"

export type SwipeableTaskProps = TaskComponentProps & {
  disableSwipe?: boolean
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  swipeLeftBackground?: string
  swipeRightBackground?: string
  swipeLeftIcon?: React.ReactNode
  swipeRightIcon?: React.ReactNode
}

const SwipeableTask = React.forwardRef(
  (
    {
      disableSwipe,
      onSwipeLeft = noop,
      onSwipeRight = noop,
      swipeLeftBackground = "tomato",
      swipeLeftIcon = <DeleteIcon />,
      swipeRightBackground = "dodgerblue",
      swipeRightIcon = <CheckIcon />,
      onSelectTask = noop,
      onItemClick = noop,
      ...taskProps
    }: SwipeableTaskProps,
    ref: any,
  ) => {
    const instance = useInstance({
      over: false,
      direction: "none",
      isDragging: false,
    })

    const [direction, setDirection] = React.useState<Direction>("none")
    instance.direction = direction

    function updateDirection(val: Direction) {
      setDirection(val)
      instance.direction = val
    }

    const [spring, set] = useSpring(() => ({
      config: {
        mass: 1,
        tension: 300,
        friction: 1,
        clamp: true,
        precision: 0.5,
      },
      to: { x: 0 },
      onRest: () => {
        if (instance.over) {
          if (instance.direction === "left") {
            setTimeout(onSwipeLeft, 250)
          } else if (instance.direction === "right") {
            setTimeout(onSwipeRight, 250)
          } else {
            logError(new Error("Animation ended without direction"))
          }
        }
      },
    })) as any[]

    const bind = useGesture(
      {
        onDragStart: () => {
          instance.isDragging = true
        },
        onDragEnd: () => {
          // Delay to ensure this runs after any click events run
          setTimeout(() => {
            instance.isDragging = false
          }, 0)
        },
        onDrag: ({ down, movement: [mx], direction: [xDir], velocity }) => {
          const trigger = velocity > 0.5
          const dir = xDir < 0 ? -1 : 1

          const isOver = !down && trigger
          const x = isOver ? window.innerWidth * dir : down ? mx : 0

          const dirVal = mx < 0 ? "left" : "right"
          if (direction !== dirVal) {
            updateDirection(dirVal)
          }

          if (isOver) {
            instance.over = true
          }

          // if (instance.over) {
          //   if (instance.direction === "left") {
          //     setTimeout(onSwipeLeft, 250)
          //   } else if (instance.direction === "right") {
          //     setTimeout(onSwipeRight, 250)
          //   } else {
          //     logError(new Error("Animation ended without direction"))
          //   }
          // }

          set({ x })
        },
      },
      { drag: { axis: "x" } },
    )

    const dragAwareOnItemClick = React.useCallback(
      (id: ID) => {
        if (!instance.isDragging) {
          onItemClick(id)
        }
      },
      [onItemClick],
    )

    const dragAwareOnSelectTask = React.useCallback(
      (id: ID) => {
        if (!instance.isDragging) {
          onSelectTask(id)
        }
      },
      [onSelectTask],
    )

    const left = direction === "left"
    const right = direction === "right"

    return (
      <div
        css={css`
          width: 100%;
          position: relative;
          overflow-x: hidden;
        `}
      >
        <ListItem
          className={right ? "fj-s" : left ? "fj-e" : undefined}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            top: 0,
            left: 0,
            backgroundColor: right
              ? swipeRightBackground
              : left
              ? swipeLeftBackground
              : undefined,
          }}
        >
          <IconButton style={{ color: "white" }}>
            {right ? swipeRightIcon : left ? swipeLeftIcon : undefined}
          </IconButton>
        </ListItem>

        <animated.div
          {...(disableSwipe ? undefined : bind())}
          style={{
            transform: spring.x.interpolate((x: any) => `translateX(${x}px)`),
          }}
        >
          <Task
            {...taskProps}
            ref={ref}
            onItemClick={dragAwareOnItemClick}
            onSelectTask={dragAwareOnSelectTask}
          />
        </animated.div>
      </div>
    )
  },
)

export default SwipeableTask
