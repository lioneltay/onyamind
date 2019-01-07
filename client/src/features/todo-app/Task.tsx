import React, { forwardRef } from "react"
import styled from "styled-components"
import { Task, ID } from "./types"
import { noop } from "lib/typedash"

import { Button, Input, Checkbox } from "./widgets"

const Container = styled.div`
  display: flex;
  align-items: center;

  padding: 5px 0px;
`

const TodoTitle = styled.span`
  font-size: 16px;
  padding: 10px 18px;
`

type Props = Stylable & {
  onEdit?: (data: Partial<Omit<Task, "id">>) => void
  onRequestEdit?: (id: ID) => void
  onRemove?: (id: ID) => void
  task: Task
}

const TaskItem: React.FunctionComponent<Props> = (
  {
    onEdit = noop,
    onRemove = noop,
    onRequestEdit = noop,
    task,
    style,
    className,
  },
  ref,
) => {
  return (
    <Container ref={ref} style={style} className={className}>
      <Checkbox
        data-testid="complete-checkbox"
        className="mr-3"
        checked={task.complete}
        onChange={complete => onEdit({ complete })}
      />

      <TodoTitle
        className="fg-1"
        style={{
          textDecoration: task.complete ? "line-through" : "none",
          color: task.complete ? "#a3a3a3" : "black",
        }}
      >
        {task.title}
      </TodoTitle>

      <Button
        className="ml-3"
        style={{ border: "none", margin: 0 }}
        color="black"
      >
        <i className="fas fa-pen" onClick={() => onRequestEdit(task.id)} />
      </Button>

      <Button
        data-testid="delete-cross"
        className="ml-3"
        color="tomato"
        style={{ border: "none", margin: 0 }}
        onClick={() => onRemove(task.id)}
      >
        <i className="fas fa-times" />
      </Button>
    </Container>
  )
}

export default forwardRef(TaskItem)
