import React from "react"
import { noopTemplate as css } from "lib/utils"

import { useSpring, config, animated } from "react-spring"
import { useGesture } from "react-use-gesture"

import { IconButton, ListItem } from "@material-ui/core"

import { DeleteIcon, CheckIcon } from "lib/icons"

import Task, { TaskProps } from "./Task"

import { logError } from "services/analytics/error-reporting"

type Direction = "left" | "right" | "none"

type Props = TaskProps & {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  swipeLeftBackground?: string
  swipeRightBackground?: string
  swipeLeftIcon?: React.ReactNode
  swipeRightIcon?: React.ReactNode
  onItemClick?: (id: ID) => void
}

export default ({
  onSwipeLeft = () => {},
  onSwipeRight = () => {},
  swipeLeftBackground = "tomato",
  swipeLeftIcon = <DeleteIcon />,
  swipeRightBackground = "dodgerblue",
  swipeRightIcon = <CheckIcon />,
  onItemClick = () => {},
  task,
  ...taskProps
}: Props) => {
  const [direction, setDirection] = React.useState<Direction>("none")
  const directionRef = React.useRef(direction)
  directionRef.current = direction
  function updateDirection(val: Direction) {
    setDirection(val)
    directionRef.current = val
  }
  const overRef = React.useRef(false)

  const [spring, set] = useSpring(() => ({
    config: config.stiff,
    to: { x: 0 },
    onRest: () => {},
  })) as any[]

  const bind = useGesture({
    onDragEnd: ({ distance }) => {
      if (overRef.current !== true && distance < 30) {
        onItemClick(task.id)
      }
    },
    onDrag: ({ down, movement: [mx], direction: [xDir], velocity }) => {
      const trigger = velocity > 0.3
      const dir = xDir < 0 ? -1 : 1

      const isOver = !down && trigger
      const x = isOver ? window.innerWidth * dir : down ? mx : 0

      const dirVal = mx < 0 ? "left" : "right"
      if (direction !== dirVal) {
        updateDirection(dirVal)
      }

      if (isOver) {
        overRef.current = true
      }

      if (overRef.current) {
        const direction = directionRef.current
        if (direction === "left") {
          setTimeout(onSwipeLeft, 500)
        } else if (direction === "right") {
          setTimeout(onSwipeRight, 500)
        } else {
          logError(new Error("Animation ended without direction"))
        }
      }

      set({ x })
    },
  })

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
        {...bind()}
        style={{
          transform: spring.x.interpolate((x: any) => `translateX(${x}px)`),
        }}
      >
        <Task {...taskProps} task={task} />
      </animated.div>
    </div>
  )
}
