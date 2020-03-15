import React, { Fragment } from "react"
import { RouteComponentProps } from "react-router-dom"
import { noopTemplate as css } from "lib/utils"

import { List, LinearProgress, Fade } from "@material-ui/core"

import { Task, Header } from "./components"

import { useTheme } from "theme"
import { useSelector, useActions } from "services/store"
import { MOBILE_WIDTH } from "config"

const Content = () => {
  const theme = useTheme()

  const { editingTaskId, tasks } = useSelector((state, s) => ({
    editingTaskId: s.listPage.editingTaskId(state),
    loadingTasks: s.listPage.loadingTasks(state),
    tasks: state.listPage.trashTasks,
  }))

  if (!tasks) {
    return (
      <Fade in={true} style={{ transitionDelay: "800ms" }}>
        <LinearProgress />
      </Fade>
    )
  }

  return (
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
  )
}

type Props = RouteComponentProps<{ listId: string; listName: string }> & {}

export default ({ match }: Props) => {
  const { selectTaskList } = useActions()

  React.useEffect(() => {
    selectTaskList(match.params.listId)
    return () => {
      selectTaskList(null)
    }
  }, [match.params.listId])

  return (
    <Fragment>
      <Header />

      <section
        css={css`
          display: flex;
          justify-content: center;
          padding-bottom: 50px;
          @media (min-width: ${MOBILE_WIDTH}px) {
            padding-top: 24px;
          }
          padding-bottom: 50px;
        `}
      >
        <div
          css={css`
            width: 100%;
            max-width: 600px;
          `}
        >
          <Content />
        </div>
      </section>
    </Fragment>
  )
}
