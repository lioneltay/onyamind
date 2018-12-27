import React from "react"
import styled from "styled-components"

import { Button, Input } from "./widgets"

const Container = styled.div`
  display: flex;
  justify-content: space-between;
`

type Props = Stylable & {
  onAdd: (task: string) => Promise<void>
  title: string
  onChange: (title: string) => void
}

type State = {
  saving: boolean
}

export default class TaskAdder extends React.Component<Props, State> {
  state: State = {
    saving: false,
  }

  render() {
    return (
      <Container className={this.props.className} style={this.props.style}>
        <Input
          className="fg-1"
          placeholder="Add a task"
          value={this.props.title}
          onChange={e => this.props.onChange(e.currentTarget.value)}
        />

        <Button
          className="ml-3"
          disabled={this.props.title.length === 0}
          onClick={() => {
            this.setState({ saving: true })
            this.props
              .onAdd(this.props.title)
              .then(() => this.setState({ saving: false }))
              .catch(() => this.setState({ saving: false }))
          }}
        >
          Add Task
        </Button>
      </Container>
    )
  }
}
