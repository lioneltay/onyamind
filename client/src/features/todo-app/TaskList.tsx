import React from "react"
import styled from "styled-components"
import { Task } from "./types"
import TaskItem from "./Task"
import { Transition, config } from "react-spring"

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
      <Transition
        config={{ duration: 100 }}
        items={tasks}
        keys={task => task.id}
        from={{ height: 0, opacity: 0 }}
        enter={{ height: "auto", opacity: 1 }}
        leave={{ height: 0, opacity: 0 }}
      >
        {task => props => <TaskItem key={task.id} style={props} task={task} />}
      </Transition>

      {/* {tasks.map(task => (
        <TaskItem key={task.id} task={task} />
      ))} */}
    </Container>
  )
}

export default TaskList
