import React, { forwardRef } from "react"
import styled from "styled-components"
import { Task } from "./types"

import { Button, IconButton } from "./widgets"
import { useAppState } from "./state"
import { removeTask, editTask } from "./api"
import { highlight_color } from "./constants"

const Container = styled.div`
  position: relative;
  max-width: 100%;

  display: grid;
  grid-template-columns: 0fr 1fr 0fr;
  align-items: center;

  padding-left: 8px;
`

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

const TaskDetails = styled.div`
  display: grid;
  padding: 0 18px;
  cursor: pointer;
`

const TaskTitle = styled.div`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 2px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`

const TaskNotes = styled.div`
  color: grey;
  font-size: 14px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`

export type Props = Stylable & {
  task: Task
}

const TaskItem: React.FunctionComponent<Props> = (
  { task, style, className },
  ref,
) => {
  const {
    selected_tasks,
    actions: { startEditingTask, toggleTaskSelection },
  } = useAppState()

  const selected = selected_tasks.findIndex(id => id === task.id) >= 0

  return (
    <Container
      ref={ref}
      className={className}
      style={{
        ...style,
        backgroundColor: selected ? highlight_color : "transparent",
      }}
    >
      <IconButton
        className={`far fa-${selected ? "check-square" : "square"}`}
        onClick={() => toggleTaskSelection(task.id)}
      />

      <TaskDetails onClick={() => startEditingTask(task.id)}>
        <TaskTitle
          className="fg-1"
          style={{
            textDecoration: task.complete ? "line-through" : "none",
            color: task.complete ? "#a3a3a3" : "black",
          }}
        >
          {task.title}
        </TaskTitle>

        <TaskNotes>{task.notes}</TaskNotes>
      </TaskDetails>

      <Overlay>
        <IconButton
          className={`fas fa-${task.complete ? "plus" : "check"}`}
          onClick={() => editTask(task.id, { complete: !task.complete })}
        />

        <IconButton
          className="fas fa-trash"
          onClick={() => removeTask(task.id)}
        />
      </Overlay>
    </Container>
  )
}

export default forwardRef(TaskItem)
