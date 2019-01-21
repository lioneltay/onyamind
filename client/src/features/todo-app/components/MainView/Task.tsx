import React from "react"
import styled from "styled-components"
import { Task } from "../../types"

import Typography from "@material-ui/core/Typography"
import IconButton from "@material-ui/core/IconButton"
import ListItem from "@material-ui/core/ListItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
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
  display: none;

  body.hasHover ${Container}:hover & {
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
}

const TaskItem: React.FunctionComponent<Props> = ({ task }) => {
  const {
    touch_screen,
    selected_task_ids,
    editing,
    actions: { startEditingTask, toggleTaskSelection, editTask, removeTask },
  } = useAppState()

  const selected = selected_task_ids.findIndex(id => id === task.id) >= 0

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
            <SingleLineWithEllipsis
              style={{
                fontWeight: 500,
                fontSize: "0.95rem",
                textDecoration: task.complete ? "line-through" : "none",
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
          onClick={() => startEditingTask(task.id)}
        />

        {editing || touch_screen ? null : (
          <Overlay>
            <IconButton
              onClick={() => editTask(task.id, { complete: !task.complete })}
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
            onClick={() => editTask(task.id, { complete: !task.complete })}
          >
            <Add />
          </IconButton>
        )}
      </Container>
    </Flipped>
  )
}

export default TaskItem
