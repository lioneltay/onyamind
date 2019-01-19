import React from "react"
import styled from "styled-components"
import { Task } from "./types"
import TaskItem from "./Task"
import { Transition, config } from "react-spring"
import { comparator } from "ramda"

const Container = styled.div``

export type Props = {
  style?: React.CSSProperties
  className?: string
  tasks: Task[]
}

const TaskList: React.FunctionComponent<Props> = ({
  tasks,
  style,
  className,
}) => {
  return (
    <Container style={style} className={className}>
      {tasks
        .sort(comparator((t1, t2) => t1.created_at > t2.created_at))
        .map(task => (
          <TaskItem key={task.id} task={task} />
        ))}
    </Container>
  )
}

export default TaskList
