import React, { useState, useRef, forwardRef } from "react"
import styled from "styled-components"

import { Spring, config } from "react-spring"
import { useGesture } from "lib/useGesture"

import ListItem from "@material-ui/core/ListItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import Fab from "@material-ui/core/Fab"
import IconButton from "@material-ui/core/IconButton"

import Assignment from "@material-ui/icons/Assignment"
import Delete from "@material-ui/icons/Delete"
import Add from "@material-ui/icons/Add"
import Check from "@material-ui/icons/Check"

import { highlight_color } from "../../../constants"
import { ListItemText } from "@material-ui/core"

import { connect } from "services/state"
import { toggleTaskSelection } from "services/state/modules/editing"
import { removeTask, editTask } from "services/state/modules/tasks"
import { ConnectedDispatcher } from "lib/rxstate"

const Container = styled.div`
  width: 100%;
  position: relative;
  overflow-x: hidden;
`

const ItemContainer = styled.div`
  background: white;
`

const StyledListItem = styled(ListItem)`
  position: relative;
  min-height: 70px;
` as any

const Overlay = styled.div`
  opacity: 0;
  pointer-events: none;
  display: none;

  body.hasHover ${StyledListItem}:hover & {
    display: flex;
    opacity: 1;
    pointer-events: all;
  }
`

const SingleLineWithEllipsis: React.FunctionComponent<Stylable> = ({
  className,
  style,
  children,
}) => {
  return (
    <span className="flex">
      <span
        className={className}
        style={{
          ...style,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {children}
      </span>
    </span>
  )
}

export type Props = {
  task: Task
  onItemClick: (id: ID) => void
  editing: boolean
  selected_task_ids: ID[]
  toggleTaskSelection: (id: ID) => void
  touch_screen: boolean
  removeTask: ConnectedDispatcher<typeof removeTask>
  editTask: ConnectedDispatcher<typeof editTask>
}

const Task = forwardRef<any, Props>(
  (
    {
      task,
      onItemClick,
      editing,
      selected_task_ids,
      toggleTaskSelection,
      touch_screen,
      removeTask,
      editTask,
    },
    ref,
  ) => {
    const selected = selected_task_ids.findIndex(id => id === task.id) >= 0

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
        console.log("swipeLeft")
        setStatus("left")
        setPercent(-100)
      },

      onSwipeRight: () => {
        console.log("swipeRight")
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
      <Spring
        config={config.stiff}
        from={{ percent }}
        to={{ percent }}
        onRest={() => {
          console.log("rest", status)
          switch (
            status
            // case "left": {
            //   removeTask(task.id)
            //   break
            // }
            // case "right": {
            //   editTask({
            //     task_id: task.id,
            //     task_data: { complete: !task.complete },
            //   })
            //   break
            // }
          ) {
          }
        }}
      >
        {spring => {
          if (Math.abs(spring.percent) > 95 && !done) {
            console.log("GOGO")
            if (status === "left" && spring.percent) {
              removeTask(task.id)
              setDone(true)
            }
            if (status === "right") {
              editTask({
                task_id: task.id,
                task_data: { complete: !task.complete },
              })
              setDone(true)
            }
          }
          return (
            <Container>
              <ListItem
                className={
                  percent > 0 ? "fj-s" : percent < 0 ? "fj-e" : undefined
                }
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  top: 0,
                  left: 0,
                  backgroundColor:
                    spring.percent > 0
                      ? "dodgerblue"
                      : spring.percent < 0
                      ? "tomato"
                      : undefined,
                }}
              >
                <IconButton style={{ color: "white" }}>
                  {spring.percent > 0 ? (
                    <Check />
                  ) : spring.percent < 0 ? (
                    <Delete />
                  ) : (
                    undefined
                  )}
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
                <ItemContainer>
                  <StyledListItem
                    ref={ref}
                    style={{
                      opacity: 1,
                      height: "auto",
                      backgroundColor: selected ? highlight_color : undefined,
                    }}
                    selected={selected}
                    button
                  >
                    <ListItemIcon>
                      <Fab
                        style={{
                          borderRadius: editing ? "50%" : "5px",
                          transition: "300ms",
                          border: selected ? "1px solid blue" : "none",
                          background: "white",
                          marginLeft: 4,
                          color: "#ccc",
                        }}
                        onClick={() => toggleTaskSelection(task.id)}
                        size="small"
                      >
                        <Assignment
                          style={{
                            transform: `scale(${editing ? 0.7 : 1})`,
                            transition: "300ms",
                          }}
                        />
                      </Fab>
                    </ListItemIcon>

                    <ListItemText
                      primary={
                        <SingleLineWithEllipsis
                          style={{
                            fontWeight: 500,
                            fontSize: "0.95rem",
                            textDecoration: task.complete
                              ? "line-through"
                              : "none",
                            color: "#202124",
                          }}
                        >
                          {task.title}
                        </SingleLineWithEllipsis>
                      }
                      secondary={
                        <SingleLineWithEllipsis style={{ fontWeight: 500 }}>
                          {task.notes}
                        </SingleLineWithEllipsis>
                      }
                      onClick={() => onItemClick(task.id)}
                    />

                    {editing || touch_screen ? null : (
                      <Overlay>
                        <IconButton
                          onClick={() =>
                            editTask({
                              task_id: task.id,
                              task_data: { complete: !task.complete },
                            })
                          }
                        >
                          {task.complete ? <Add /> : <Check />}
                        </IconButton>

                        <IconButton onClick={() => removeTask(task.id)}>
                          <Delete />
                        </IconButton>
                      </Overlay>
                    )}

                    {editing || !touch_screen || !task.complete ? null : (
                      <IconButton
                        onClick={() =>
                          editTask({
                            task_id: task.id,
                            task_data: { complete: !task.complete },
                          })
                        }
                      >
                        <Add />
                      </IconButton>
                    )}
                  </StyledListItem>
                </ItemContainer>
              </div>
            </Container>
          )
        }}
      </Spring>
    )
  },
)

export default connect(
  state => ({
    editing: state.editing,
    selected_task_ids: state.selected_task_ids,
    touch_screen: state.touch_screen,
  }),
  {
    toggleTaskSelection,
    editTask,
    removeTask,
  },
)(Task)
