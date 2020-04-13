import React from "react"
import { noopTemplate as css } from "lib/utils"

import { useSpring, config, animated } from "react-spring"
import { useDrag } from "react-use-gesture"

import { IconButton, ListItem } from "@material-ui/core"

import { DeleteIcon, CheckIcon } from "lib/icons"

import Task, { TaskProps } from "./Task"

import { logError } from "services/analytics/error-reporting"

type Props = TaskProps & {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  swipeLeftBackground?: string
  swipeRightBackground?: string
  swipeLeftIcon?: React.ReactNode
  swipeRightIcon?: React.ReactNode
}

export default ({
  onSwipeLeft = () => {},
  onSwipeRight = () => {},
  swipeLeftBackground = "tomato",
  swipeLeftIcon = <DeleteIcon />,
  swipeRightBackground = "dodgerblue",
  swipeRightIcon = <CheckIcon />,
  ...taskProps
}: Props) => {
  const [direction, setDirection] = React.useState<"left" | "right" | "none">(
    "none",
  )
  const overRef = React.useRef(false)
  const directionRef = React.useRef(direction)
  directionRef.current = direction

  const [spring, set] = useSpring(() => ({
    config: config.stiff,
    to: { x: 0 },
    onRest: () => {
      const direction = directionRef.current
      if (overRef.current) {
        if (direction === "left") {
          console.log("SWIPE LEFT")
          onSwipeLeft()
        } else if (direction === "right") {
          console.log("SWIPE RIGHT")
          onSwipeRight()
        } else {
          logError(new Error("Animation ended without direction"))
        }
      } else {
        setDirection("none")
      }
    },
  })) as any[]

  const bind = useDrag(
    ({ down, movement: [mx], direction: [xDir], velocity }) => {
      const trigger = velocity > 0.2 // If you flick hard enough it should trigger the card to fly out
      const dir = xDir < 0 ? -1 : 1 // Direction should either point left or right

      const isOver = !down && trigger
      const x = isOver ? window.innerWidth * dir : down ? mx : 0

      const dirVal = mx < 0 ? "left" : "right"
      if (direction !== dirVal) {
        setDirection(dirVal)
      }

      if (isOver) {
        overRef.current = true
      }

      set({ x })
    },
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
        onPointerDown={(e) => e.stopPropagation()}
        {...bind()}
        style={{
          transform: spring.x.interpolate((x: any) => `translateX(${x}px)`),
        }}
      >
        <Task {...taskProps} />
      </animated.div>
    </div>
  )
}
