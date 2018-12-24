import React from "react"
import styled from "styled-components"
import { Task, ID } from "./api"

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

type Props = {
  onEdit: (data: Partial<Omit<Task, "id">>) => void
  onRemove: (id: ID) => void
  task: Task
}

type State = {
  title: string
  checked: boolean
}

export default class TaskItem extends React.Component<Props, State> {
  state = {
    title: this.props.task.title,
    checked: false,
  }

  render() {
    const { task } = this.props

    return (
      <Container key={task.id}>
        <Checkbox
          className="mr-3"
          checked={task.complete}
          onChange={complete => this.props.onEdit({ complete })}
        />

        <TodoTitle
          className="fg-1"
          style={{
            textDecoration: task.complete ? "line-through" : "none",
            color: task.complete ? "#a3a3a3" : "black",
          }}
        >
          {this.state.title}
        </TodoTitle>

        {/* <Button className="ml-3" color="black">
          <i
            className="fas fa-pen"
            onClick={() => this.props.onEdit({ title: this.state.title })}
          />
        </Button> */}

        <Button className="ml-3" color="tomato" style={{ border: "none" }}>
          <i
            className="fas fa-times"
            onClick={() => this.props.onRemove(task.id)}
          />
        </Button>
      </Container>
    )
  }
}
