import React from "react"
import styled from "styled-components"
import { Task } from "../../types"

import IconButton from "@material-ui/core/IconButton"
import ListItem from "@material-ui/core/ListItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction"
import Fab from "@material-ui/core/Fab"

import Delete from "@material-ui/icons/Delete"
import Add from "@material-ui/icons/Add"
import DragHandle from "@material-ui/icons/DragHandle"
import Check from "@material-ui/icons/Check"
import Assignment from "@material-ui/icons/Assignment"
import { useAppState } from "../../state"

import { Flipped } from "react-flip-toolkit"

import { highlight_color } from "../../constants"
import { ListItemText } from "@material-ui/core"

const Container = styled(ListItem)`
  position: relative;
  min-height: 70px;
` as any

const Overlay = styled.div`
  opacity: 0;
  pointer-events: none;

  body.hasHover ${Container}:hover & {
    opacity: 1;
    pointer-events: all;
  }
`

export type Props = {
  task: Task
}

const TaskItem: React.FunctionComponent<Props> = ({ task }) => {
  const {
    touch_screen,
    selected_tasks,
    editing,
    actions: { startEditingTask, toggleTaskSelection, editTask, removeTask },
  } = useAppState()

  const selected = selected_tasks.findIndex(id => id === task.id) >= 0

  return (
    <Flipped flipId={task.id}>
      <Container
        selected={selected}
        button
        style={{
          backgroundColor: selected ? highlight_color : undefined,
        }}
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
            <span
              style={{
                textDecoration: task.complete ? "line-through" : "none",
              }}
            >
              {task.title}
            </span>
          }
          secondary={task.notes}
          onClick={() => startEditingTask(task.id)}
        />

        {editing || touch_screen ? null : (
          <Overlay>
            <ListItemSecondaryAction>
              <IconButton
                onClick={() => editTask(task.id, { complete: !task.complete })}
              >
                {task.complete ? <Add /> : <Check />}
              </IconButton>

              <IconButton onClick={() => removeTask(task.id)}>
                <Delete />
              </IconButton>
            </ListItemSecondaryAction>
          </Overlay>
        )}

        {editing || !touch_screen || !task.complete ? null : (
          <IconButton
            onClick={() => editTask(task.id, { complete: !task.complete })}
          >
            <Add />
          </IconButton>
        )}

        {editing ? (
          <IconButton disableRipple style={{ cursor: "move" }}>
            <DragHandle />
          </IconButton>
        ) : null}
      </Container>
    </Flipped>
  )
}

export default TaskItem
