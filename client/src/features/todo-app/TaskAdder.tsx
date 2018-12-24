import React from "react"
import styled from "styled-components"

import { Button, Input } from "./widgets"

const Container = styled.div`
  display: flex;
  justify-content: space-between;
`

type Props = Stylable & {
  onAdd: (task: string) => Promise<void>
}

type State = {
  task: string
  saving: boolean
}

export default class TaskAdder extends React.Component<Props, State> {
  state: State = {
    task: "",
    saving: false,
  }

  render() {
    return (
      <Container className={this.props.className} style={this.props.style}>
        <Input
          className="fg-1"
          placeholder="Add a task"
          value={this.state.task}
          onChange={e => this.setState({ task: e.target.value })}
        />

        <Button
          className="ml-3"
          onClick={() => {
            this.setState({ saving: true })
            this.props
              .onAdd(this.state.task)
              .then(() => this.setState({ task: "", saving: false }))
              .catch(() => this.setState({ saving: false }))
          }}
        >
          Add Task
        </Button>
      </Container>
    )
  }
}
