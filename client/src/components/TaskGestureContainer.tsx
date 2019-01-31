import React, { useState, useRef } from "react"
import styled from "styled-components"

import { useGesture } from "lib/useGesture"
import { Spring, config } from "react-spring"

import IconButton from "@material-ui/core/IconButton"
import ListItem from "@material-ui/core/ListItem"

const Container = styled.div`
  width: 100%;
  position: relative;
  overflow-x: hidden;
`

type GestureContainerProps = {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  leftBackground: string
  rightBackground: string
  leftIcon: React.ReactNode
  rightIcon: React.ReactNode
}

const TaskGestureContainer: React.FunctionComponent<GestureContainerProps> = ({
  children,
  onSwipeLeft = () => {},
  onSwipeRight = () => {},
  leftBackground,
  leftIcon,
  rightBackground,
  rightIcon,
}) => {
  const [percent, setPercent] = useState(0)
  const [status, setStatus] = useState("default" as
    | "default"
    | "pulling"
    | "left"
    | "right")
  const container_ref = useRef(null as null | HTMLElement)
  const [done, setDone] = useState(false)

  const bind = useGesture({
    onPull: ({ displacement: [dx] }) => {
      setStatus("pulling")
      if (container_ref.current) {
        const box = container_ref.current.getBoundingClientRect()
        setPercent((dx / box.width) * 100)
      }
    },

    onSwipeLeft: () => {
      setStatus("left")
      setPercent(-100)
    },

    onSwipeRight: () => {
      setStatus("right")
      setPercent(100)
    },

    onPointerUp: () => {
      if (status === "pulling") {
        setStatus("default")
        setPercent(0)
      }
    },
  })

  return (
    <Spring config={config.stiff} from={{ percent }} to={{ percent }}>
      {spring => {
        if (Math.abs(spring.percent) > 95 && !done) {
          if (status === "left" && spring.percent) {
            onSwipeLeft()
            setDone(true)
          }
          if (status === "right") {
            onSwipeRight()
            setDone(true)
          }
        }

        const left = spring.percent < 0
        const right = spring.percent > 0

        return (
          <Container>
            <ListItem
              className={right ? "fj-s" : left ? "fj-e" : undefined}
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                top: 0,
                left: 0,
                backgroundColor: right
                  ? rightBackground
                  : left
                  ? leftBackground
                  : undefined,
              }}
            >
              <IconButton style={{ color: "white" }}>
                {right ? rightIcon : left ? leftIcon : undefined}
              </IconButton>
            </ListItem>
            <div
              {...bind({ ref: container_ref })}
              style={{
                transform:
                  status === "pulling"
                    ? `translateX(${percent}%)`
                    : `translateX(${spring.percent}%)`,
              }}
            >
              {children}
            </div>
          </Container>
        )
      }}
    </Spring>
  )
}

export default TaskGestureContainer
