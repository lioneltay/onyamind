import React, { useState, useRef } from "react"
import styled from "styled-components"

import { useGesture } from "lib/useGesture"
import { Spring, config } from "react-spring/renderprops.cjs"

import { IconButton, ListItem } from "@material-ui/core"

import { DeleteIcon, CheckIcon } from "lib/icons"

import Task, { TaskProps } from "./Task"

const Container = styled.div`
  width: 100%;
  position: relative;
  overflow-x: hidden;
`

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
  const [percent, setPercent] = useState(0)
  const [status, setStatus] = useState(
    "default" as "default" | "pulling" | "left" | "right",
  )
  const containerRef = useRef(null as null | HTMLElement)
  const [done, setDone] = useState(false)

  const bind = useGesture({
    onPull: ({ displacement: [dx] }) => {
      setStatus("pulling")
      if (containerRef.current) {
        const box = containerRef.current.getBoundingClientRect()
        setPercent((dx / box.width) * 100)
      }
    },

    onPullEnd: () => {
      if (status === "pulling") {
        setStatus("default")
        setPercent(0)
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
  })

  return (
    <Spring config={config.stiff} from={{ percent }} to={{ percent }}>
      {(spring) => {
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
            <div
              onPointerDown={(e) => e.stopPropagation()}
              {...bind({ ref: containerRef })}
              style={{
                transform:
                  status === "pulling"
                    ? `translateX(${percent}%)`
                    : `translateX(${spring.percent}%)`,
              }}
            >
              <Task {...taskProps} />
            </div>
          </Container>
        )
      }}
    </Spring>
  )
}
