import React from "react"
import styled from "styled-components"

import { withContext } from "lib/react-context-hoc"
import { StateContainer, ContextType } from "./state-container"
import { Task } from "./api"

import TaskItem from "./Task"
import TaskAdder from "./TaskAdder"

const PageContainer = styled.div`
  display: flex;
  justify-content: center;

  padding-top: 50px;
  padding-bottom: 50px;

  background: linear-gradient(#71afd1, #3ae7bb);
  min-height: 100vh;
`

const Container = styled.div`
  width: 100%;
  max-width: 600px;
`

const HeaderContainer = styled.div`
  padding: 10px 20px;
  background: teal;
  font-size: 25px;
`

const Header = styled.div`
  color: white;
`

const TaskContainer = styled.div`
  background: white;
  padding: 20px 20px;
`

type Props = {
  context: ContextType
}

type State = {
  title: string
}

class TaskPageImplementation extends React.Component<Props, State> {
  state: State = {
    title: "",
  }

  componentDidMount() {
    this.props.context.actions.getTasks()
  }

  render() {
    return (
      <PageContainer>
        <Container>
          <HeaderContainer>
            <Header>Tasks</Header>
          </HeaderContainer>

          <TaskContainer>
            <TaskAdder
              onAdd={task =>
                this.props.context.actions
                  .addTask({
                    title: task,
                  })
                  .then(() => this.setState({ title: "" }))
              }
            />

            <div className="my-3" style={{ height: 1, background: "#eee" }} />

            {this.props.context.state.tasks
              .sort((a, b) => (a.created_at < b.created_at ? -1 : 1))
              .map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onEdit={(data) =>
                    this.props.context.actions.editTask(task.id, data)
                  }
                  onRemove={() =>
                    this.props.context.actions.removeTask(task.id)
                  }
                />
              ))}
          </TaskContainer>
        </Container>{" "}
      </PageContainer>
    )
  }
}

const TaskPage = withContext(StateContainer.Context, "context")(
  TaskPageImplementation,
)

export const Page = () => (
  <StateContainer.Provider>
    <TaskPage />
  </StateContainer.Provider>
)