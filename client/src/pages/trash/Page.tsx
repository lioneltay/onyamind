import React from "react"
import { RouteComponentProps } from "react-router-dom"
import { noopTemplate as css } from "lib/utils"
import styled from "styled-components"

import { List, LinearProgress, Fade } from "@material-ui/core"

import Task from "./components/Task"

import { useTheme } from "theme"
import { useSelector, useActions } from "services/store"

const OuterContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-bottom: 50px;
  margin-top: 24px;
  margin-bottom: 48px;
`

const Container = styled.div`
  width: 100%;
  max-width: 600px;
`

type Props = RouteComponentProps<{ listId: string; listName: string }> & {}

export default ({ match }: Props) => {
  const theme = useTheme()

  const { selectTaskList } = useActions()

  React.useEffect(() => {
    selectTaskList(match.params.listId)
    return () => {
      selectTaskList(null)
    }
  }, [match.params.listId])

  const { editingTaskId, tasks } = useSelector((state, s) => ({
    editingTaskId: s.listPage.editingTaskId(state),
    loadingTasks: s.listPage.loadingTasks(state),
    tasks: state.listPage.trashTasks,
  }))

  if (!tasks) {
    return (
      <OuterContainer>
        <Container>
          <Fade in={true} style={{ transitionDelay: "800ms" }}>
            <LinearProgress />
          </Fade>
        </Container>
      </OuterContainer>
    )
  }

  return (
    <OuterContainer>
      <Container>
        <List className="p-0">
          {tasks.map(task => (
            <Task
              key={task.id}
              backgroundColor={theme.backgroundColor}
              task={task}
              selected={editingTaskId === task.id}
            />
          ))}
        </List>
      </Container>
    </OuterContainer>
  )
}
