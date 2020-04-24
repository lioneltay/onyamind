import React, { Fragment } from "react"
import { RouteComponentProps } from "react-router-dom"
import { noopTemplate as css } from "lib/utils"

import { List, LinearProgress, Fade } from "@material-ui/core"

import { Task } from "./components"

import { useTheme } from "theme"
import { useSelector, useActions } from "services/store"
import { MOBILE_WIDTH } from "config"

import { onTrashTasksChange } from "./api"

import { Helmet } from "react-helmet"
import { TransitionTaskList } from "components"

const Content = () => {
  const theme = useTheme()

  const { editingTaskId, tasks } = useSelector((state, s) => ({
    editingTaskId: s.listPage.editingTaskId(state),
    loadingTasks: s.listPage.loadingTasks(state),
    tasks: state.trashPage.trashTasks,
  }))

  if (!tasks) {
    return (
      <Fade in={true} style={{ transitionDelay: "800ms" }}>
        <LinearProgress />
      </Fade>
    )
  }

  return (
    <List className="p-0" style={{ backgroundColor: theme.backgroundColor }}>
      <TransitionTaskList tasks={tasks}>
        {(task) => (
          <Task
            key={task.id}
            backgroundColor={theme.backgroundColor}
            task={task}
            selected={editingTaskId === task.id}
          />
        )}
      </TransitionTaskList>
    </List>
  )
}

export default () => {
  const { setTrashTasks } = useActions("trashPage")
  const { userId, trashTasksCount } = useSelector((state) => ({
    userId: state.auth.user?.uid,
    trashTasksCount: (state.trashPage.trashTasks ?? []).length,
  }))

  React.useEffect(() => {
    if (userId) {
      return onTrashTasksChange({
        userId,
        onChange: (tasks) => setTrashTasks(tasks),
      })
    }
  }, [userId])

  return (
    <Fragment>
      <Helmet>
        <title>Trash ({trashTasksCount.toString()})</title>
      </Helmet>

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
